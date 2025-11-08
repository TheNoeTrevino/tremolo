// Package services provides authentication and user management functionality
package services

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"sight-reading/database"
	"sight-reading/logger"
	"sight-reading/middleware"

	dtos "sight-reading/DTOs"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Login authenticates a user and returns a JWT token
func Login(c *gin.Context) {
	var reqBody dtos.LoginRequest

	// Bind JSON request body
	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	// Validate request
	// WARN: is this really necessary here? we dont need complex password rules for login
	// since we enforce it at the registration phase
	err = reqBody.ValidateLoginRequest()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Check if account is locked
	normalizedEmail := normalizeEmail(reqBody.Email)
	isLocked, lockedUntil, err := checkAccountLocked(normalizedEmail)
	if err != nil {
		logger.Error("Error checking account lock status", "error", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "Internal server error.",
			"scenario": "AS.10",
		})
		return
	}

	if isLocked && lockedUntil != nil {
		logger.Info("Login attempt on locked account", "email", normalizedEmail)
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":    "Account is locked due to too many failed login attempts",
			"scenario": "AS.11",
		})
		return
	}

	// language: sql
	query := `
		SELECT id, email, first_name, last_name, role, password
		FROM users
		WHERE email = $1
	`

	var user struct {
		ID           int            `db:"id"`
		Email        string         `db:"email"`
		FirstName    string         `db:"first_name"`
		LastName     string         `db:"last_name"`
		Role         string         `db:"role"`
		PasswordHash sql.NullString `db:"password"`
	}

	err = database.DBClient.Get(&user, query, normalizedEmail)
	if err != nil {
		if err == sql.ErrNoRows {
			logger.Info("User not found with provided", "email", normalizedEmail)
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid credentials",
			})
			return
		}
		// database acces error
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "Internal server error",
			"scenario": "AS.12",
		})
		return
	}

	// Check if password hash exists
	if !user.PasswordHash.Valid || user.PasswordHash.String == "" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid credentials",
		})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash.String), []byte(reqBody.Password))
	if err != nil {
		logger.Info("Invalid password, incrementing failed attempts", "error", err.Error())
		if err := incrementFailedAttempts(normalizedEmail); err != nil {
			logger.Error("Failed to increment failed attempts", "error", err.Error())
		}

		// Check if we should lock the account
		attempts, err := getFailedAttempts(normalizedEmail)
		if err != nil {
			logger.Error("Failed to get failed attempts", "error", err.Error())
		} else {
			maxAttempts := getMaxLoginAttempts()
			if attempts >= maxAttempts {
				lockDuration := getLockoutDuration()
				if err := lockAccount(normalizedEmail, lockDuration); err != nil {
					logger.Error("Failed to lock account", "error", err.Error())
				} else {
					logger.Info("Account locked due to failed login attempts", "email", normalizedEmail, "attempts", attempts)
					c.JSON(http.StatusUnauthorized, gin.H{
						"error": fmt.Sprintf("Account locked for %d minutes due to too many failed login attempts", int(lockDuration.Minutes())),
					})
					return
				}
			}
		}

		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid credentials",
		})
		return
	}

	// password is correct, lift the lockout
	if err := resetLockout(normalizedEmail); err != nil {
		logger.Error("Failed to reset lockout", "error", err.Error())
		// continue with login even if reset fails tho?
	}

	// Generate access token
	accessToken, err := middleware.GenerateAccessToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate access token",
		})
		return
	}

	// Generate refresh token
	refreshToken, err := middleware.GenerateRefreshToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate refresh token",
		})
		return
	}

	response := dtos.LoginResponse{
		User: dtos.UserResponse{
			ID:        user.ID,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Role:      user.Role,
		},
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	c.JSON(http.StatusOK, response)
}

// GetCurrentUser returns the current authenticated user's information
func GetCurrentUser(c *gin.Context) {
	// TODO: check if this works
	// Get user ID from context (set by auth middleware)
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Unauthorized",
		})
		return
	}

	// Convert to int
	uid, ok := userID.(int)
	if !ok {
		logger.Error("Error parsing userID")
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "Internal server error",
			"scenario": "AS.5",
		})
		return
	}

	// language: sql
	query := `
		SELECT id, email, first_name, last_name, role
		FROM users
		WHERE id = $1
	`

	var user dtos.UserResponse

	err := database.DBClient.Get(&user, query, uid)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Unauthorized",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "Internal server error",
			"scenario": "AS.6",
		})
		return
	}

	c.JSON(http.StatusOK, user)
}

func HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), 12)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}
	return string(hashedBytes), nil
}

func Register(c *gin.Context) {
	var reqBody dtos.RegisterRequest

	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid request body",
		})
		return
	}

	err = reqBody.ValidateRegisterRequest()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	exists, err := checkIfUserExists(normalizeEmail(reqBody.Email))
	if err != nil {
		logger.Error("Database error. Scenario: AS.7", "error", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    "Internal server error.",
			"scenario": "AS.8",
		})
		return
	}

	if exists {
		logger.Info("Attempt to register user with existing email. Scenario: AS.9", "email", reqBody.Email)
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Email already exists",
		})
		return
	}
	// Hash the password
	passwordHash, err := HashPassword(reqBody.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to process password",
		})
		return
	}

	// language: sql
	insertQuery := `
		INSERT INTO users (email, password, first_name, last_name, role)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, email, first_name, last_name, role
	`

	var newUser dtos.UserResponse
	err = database.DBClient.QueryRowx(insertQuery,
		normalizeEmail(reqBody.Email), // lowercase it
		passwordHash,
		reqBody.FirstName,
		reqBody.LastName,
		reqBody.Role,
	).StructScan(&newUser)
	if err != nil {
		logger.Error("Failed to create user", "error", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	response := dtos.RegisterResponse{
		Message: "User created successfully",
		User:    newUser,
	}

	c.JSON(http.StatusCreated, response)
}

func checkIfUserExists(email string) (bool, error) {
	var existingUserID int

	// language: sql
	checkQuery := `
	SELECT id FROM users WHERE email = $1
	`
	err := database.DBClient.Get(&existingUserID, checkQuery, email)

	if err == nil {
		return true, nil
	} else if err != sql.ErrNoRows {
		return false, fmt.Errorf("database error: %w", err)
	}
	return false, nil
}

// emails with different cases are considered different
func normalizeEmail(email string) string {
	return strings.ToLower(email)
}

// returns the maximum allowed login attempts from environment
// TODO: add this to global env or something?
func getMaxLoginAttempts() int {
	return 5 // default to 5 attempts for now. Idk if we should make this an env var or not
}

// getLockoutDuration returns the account lockout duration from environment
func getLockoutDuration() time.Duration {
	if val := os.Getenv("ACCOUNT_LOCKOUT_DURATION_MINUTES"); val != "" {
		if parsed, err := strconv.Atoi(val); err == nil {
			return time.Duration(parsed) * time.Minute
		}
	}
	return 15 * time.Minute // default to 15 minutes
}

// checkAccountLocked checks if an account is currently locked
//
// Returns: isLocked, lockedUntil, error
func checkAccountLocked(email string) (bool, *time.Time, error) {
	var lockedUntil sql.NullTime

	// language: sql
	query := `
		SELECT locked_until
		FROM users
		WHERE email = $1 AND locked_until > NOW()
	`

	err := database.DBClient.Get(&lockedUntil, query, email)
	if err != nil {
		if err == sql.ErrNoRows {
			// No locked record found - account is not locked
			return false, nil, nil
		}
		return false, nil, fmt.Errorf("database error checking lock status: %w", err)
	}

	if lockedUntil.Valid {
		return true, &lockedUntil.Time, nil
	}

	return false, nil, nil
}

// incrementFailedAttempts increments the failed login attempts counter for a user
func incrementFailedAttempts(email string) error {
	// language: sql
	query := `
		UPDATE users
		SET failed_login_attempts = failed_login_attempts + 1
		WHERE email = $1
	`

	_, err := database.DBClient.Exec(query, email)
	if err != nil {
		return fmt.Errorf("failed to increment failed attempts: %w", err)
	}

	return nil
}

// getFailedAttempts retrieves the current failed login attempts for a user
func getFailedAttempts(email string) (int, error) {
	var attempts int

	// language: sql
	query := `
		SELECT failed_login_attempts
		FROM users
		WHERE email = $1
	`

	err := database.DBClient.Get(&attempts, query, email)
	if err != nil {
		return 0, fmt.Errorf("failed to get failed attempts: %w", err)
	}

	return attempts, nil
}

// lockAccount locks an account for a specified duration
func lockAccount(email string, duration time.Duration) error {
	lockedUntil := time.Now().Add(duration)

	// language: sql
	query := `
		UPDATE users
		SET locked_until = $1
		WHERE email = $2
	`

	_, err := database.DBClient.Exec(query, lockedUntil, email)
	if err != nil {
		return fmt.Errorf("failed to lock account: %w", err)
	}

	logger.Info("Account locked", "email", email, "locked_until", lockedUntil)
	return nil
}

// resetLockout resets failed login attempts and unlocks the account
func resetLockout(email string) error {
	// language: sql
	query := `
		UPDATE users
		SET failed_login_attempts = 0, locked_until = NULL
		WHERE email = $1
	`

	_, err := database.DBClient.Exec(query, email)
	if err != nil {
		return fmt.Errorf("failed to reset lockout: %w", err)
	}

	return nil
}

// RefreshToken validates a refresh token and generates a new access token
func RefreshToken(c *gin.Context) {
	var reqBody struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := c.ShouldBindJSON(&reqBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Refresh token is required",
		})
		return
	}

	// validate refresh token
	claims := &middleware.Claims{}
	token, err := jwt.ParseWithClaims(reqBody.RefreshToken, claims, func(token *jwt.Token) (interface{}, error) {
		// Verify signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return middleware.GetJWTSecret(), nil
	})

	if err != nil || !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid refresh token",
		})
		return
	}

	// Verify its actually a refresh token
	if claims.TokenType != "refresh" {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid token type",
		})
		return
	}

	newAccessToken, err := middleware.GenerateAccessToken(claims.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate access token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"access_token": newAccessToken,
	})
}
