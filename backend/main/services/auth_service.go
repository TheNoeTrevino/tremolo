// Package services provides authentication and user management functionality
package services

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"sight-reading/database"
	"sight-reading/logger"
	"sight-reading/middleware"

	dtos "sight-reading/DTOs"

	"github.com/gin-gonic/gin"
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
	err = reqBody.ValidateLoginRequest()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Query user by email
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

	err = database.DBClient.Get(&user, query, normalizeEmail(reqBody.Email))
	if err != nil {
		if err == sql.ErrNoRows {
			// User not found - return generic error for security
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid credentials",
			})
			return
		}
		// Database error
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Internal server error",
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

	// Verify password using constant-time comparison
	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash.String), []byte(reqBody.Password))
	if err != nil {
		// Invalid password
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Invalid credentials",
		})
		return
	}

	// Generate JWT token
	token, err := middleware.GenerateToken(user.ID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to generate token",
		})
		return
	}

	// Prepare response
	response := dtos.LoginResponse{
		User: dtos.UserResponse{
			ID:        user.ID,
			Email:     user.Email,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Role:      user.Role,
		},
		Token: token,
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
			"error": "Internal server error",
		})
		return
	}

	// Query user by ID
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
			"error": "Internal server error",
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
		logger.Error("Database error. Scenario: AS.2", "error", err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Internal server error",
		})
		return
	}

	if exists {
		logger.Info("Attempt to register user with existing email. Scenario: AS.1", "email", reqBody.Email)
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

	// Insert new user
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
