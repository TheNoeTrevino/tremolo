// Package services provides chart data fetching for performance metrics visualization
package services

import (
	"database/sql"
	"net/http"
	"sight-reading/database"
	"sight-reading/logger"
	"strconv"

	dtos "sight-reading/DTOs"

	"github.com/gin-gonic/gin"
)

// GetUserChartData fetches personal metrics for a specific user
// Query params: interval (day/week/month/year), days (default 30)
// Protected: Requires JWT authentication, users can only access their own data
func GetUserChartData(c *gin.Context) {
	// Extract authenticated user ID from context (set by AuthMiddleware)
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	authenticatedUserID, ok := userIDInterface.(int)
	if !ok {
		logger.Error("Failed to parse authenticated user ID from context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
		return
	}

	// Extract requested user ID from URL parameter
	requestedUserIDStr := c.Param("userId")
	requestedUserID, err := strconv.Atoi(requestedUserIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID parameter"})
		return
	}

	// Security: Verify user can only access their own data
	if authenticatedUserID != requestedUserID {
		logger.Info("User attempted to access another user's chart data",
			"authenticated_user", authenticatedUserID,
			"requested_user", requestedUserID)
		c.JSON(http.StatusForbidden, gin.H{"error": "Access denied"})
		return
	}

	// Get query parameters
	interval := c.DefaultQuery("interval", "day")
	daysStr := c.DefaultQuery("days", "30")

	// Validate interval
	if !dtos.ValidateInterval(interval) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interval. Must be: day, week, month, or year"})
		return
	}

	// Convert days to int
	days, err := strconv.Atoi(daysStr)
	if err != nil || days < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid days parameter"})
		return
	}

	// Fetch each metric
	npm, err := fetchNPMData(requestedUserID, interval, days)
	if err != nil {
		logger.Error("Failed to fetch NPM data", "error", err.Error(), "user_id", requestedUserID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch NPM data"})
		return
	}

	accuracy, err := fetchAccuracyData(requestedUserID, interval, days)
	if err != nil {
		logger.Error("Failed to fetch accuracy data", "error", err.Error(), "user_id", requestedUserID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch accuracy data"})
		return
	}

	sessionCount, err := fetchSessionCountData(requestedUserID, interval, days)
	if err != nil {
		logger.Error("Failed to fetch session count data", "error", err.Error(), "user_id", requestedUserID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch session count data"})
		return
	}

	totalQuestions, err := fetchTotalQuestionsData(requestedUserID, interval, days)
	if err != nil {
		logger.Error("Failed to fetch total questions data", "error", err.Error(), "user_id", requestedUserID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch total questions data"})
		return
	}

	// Build response
	response := dtos.MultiMetricChartData{
		NPM:            npm,
		Accuracy:       accuracy,
		SessionCount:   sessionCount,
		TotalQuestions: totalQuestions,
	}

	c.JSON(http.StatusOK, response)
}

// GetTeacherClassChartData fetches aggregated metrics for all students of a teacher
// Query params: interval (day/week/month/year), days (default 30)
// Protected: Requires JWT authentication AND role=teacher
func GetTeacherClassChartData(c *gin.Context) {
	// Extract authenticated user ID from context
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	teacherID, ok := userIDInterface.(int)
	if !ok {
		logger.Error("Failed to parse teacher user ID from context")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
		return
	}

	// Verify user is a teacher
	var userRole string
	// language: sql
	roleQuery := `SELECT role FROM users WHERE id = $1`
	err := database.DBClient.Get(&userRole, roleQuery, teacherID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}
		logger.Error("Failed to verify user role", "error", err.Error(), "user_id", teacherID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify user role"})
		return
	}

	if userRole != "teacher" {
		logger.Info("Non-teacher user attempted to access class metrics",
			"user_id", teacherID,
			"role", userRole)
		c.JSON(http.StatusForbidden, gin.H{"error": "Only teachers can access class metrics"})
		return
	}

	// Get query parameters
	interval := c.DefaultQuery("interval", "day")
	daysStr := c.DefaultQuery("days", "30")

	// Validate interval
	if !dtos.ValidateInterval(interval) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid interval. Must be: day, week, month, or year"})
		return
	}

	// Convert days to int
	days, err := strconv.Atoi(daysStr)
	if err != nil || days < 1 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid days parameter"})
		return
	}

	// Fetch aggregated metrics for all students of this teacher
	npm, err := fetchTeacherNPMData(teacherID, interval, days)
	if err != nil {
		logger.Error("Failed to fetch teacher NPM data", "error", err.Error(), "teacher_id", teacherID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch NPM data"})
		return
	}

	accuracy, err := fetchTeacherAccuracyData(teacherID, interval, days)
	if err != nil {
		logger.Error("Failed to fetch teacher accuracy data", "error", err.Error(), "teacher_id", teacherID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch accuracy data"})
		return
	}

	sessionCount, err := fetchTeacherSessionCountData(teacherID, interval, days)
	if err != nil {
		logger.Error("Failed to fetch teacher session count data", "error", err.Error(), "teacher_id", teacherID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch session count data"})
		return
	}

	totalQuestions, err := fetchTeacherTotalQuestionsData(teacherID, interval, days)
	if err != nil {
		logger.Error("Failed to fetch teacher total questions data", "error", err.Error(), "teacher_id", teacherID)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch total questions data"})
		return
	}

	// Build response
	response := dtos.MultiMetricChartData{
		NPM:            npm,
		Accuracy:       accuracy,
		SessionCount:   sessionCount,
		TotalQuestions: totalQuestions,
	}

	c.JSON(http.StatusOK, response)
}

// fetchNPMData retrieves average notes per minute data for a user
// Uses date_trunc to aggregate by the specified interval
func fetchNPMData(userID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	// For "all" interval, aggregate by day with no date constraint
	if interval == "all" {
		// language: sql
		query = `
			SELECT
				date_trunc('day', created_date) as timestamp,
				AVG(notes_per_minute)::FLOAT as value
			FROM note_game_entries
			WHERE user_id = $1
			GROUP BY date_trunc('day', created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, userID)
	} else {
		// language: sql
		query = `
			SELECT
				date_trunc($1, created_date) as timestamp,
				AVG(notes_per_minute)::FLOAT as value
			FROM note_game_entries
			WHERE user_id = $2
			  AND created_date >= CURRENT_DATE - INTERVAL '1 day' * $3
			GROUP BY date_trunc($1, created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, interval, userID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	// Return empty array if no data (not an error)
	if data == nil {
		return []dtos.ChartDataPoint{}, nil
	}

	return data, nil
}

// fetchAccuracyData retrieves accuracy percentage data for a user
// Accuracy = (SUM(correct_questions) / SUM(total_questions)) * 100
func fetchAccuracyData(userID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	// For "all" interval, aggregate by day with no date constraint
	if interval == "all" {
		// language: sql
		query = `
			SELECT
				date_trunc('day', created_date) as timestamp,
				(SUM(correct_questions)::FLOAT / NULLIF(SUM(total_questions)::FLOAT, 0)) * 100 as value
			FROM note_game_entries
			WHERE user_id = $1
			GROUP BY date_trunc('day', created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, userID)
	} else {
		// language: sql
		query = `
			SELECT
				date_trunc($1, created_date) as timestamp,
				(SUM(correct_questions)::FLOAT / NULLIF(SUM(total_questions)::FLOAT, 0)) * 100 as value
			FROM note_game_entries
			WHERE user_id = $2
			  AND created_date >= CURRENT_DATE - INTERVAL '1 day' * $3
			GROUP BY date_trunc($1, created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, interval, userID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	// Return empty array if no data (not an error)
	if data == nil {
		return []dtos.ChartDataPoint{}, nil
	}

	return data, nil
}

// fetchSessionCountData retrieves session count data for a user
// Counts the number of entries per time interval
func fetchSessionCountData(userID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	// For "all" interval, aggregate by day with no date constraint
	if interval == "all" {
		// language: sql
		query = `
			SELECT
				date_trunc('day', created_date) as timestamp,
				COUNT(*)::FLOAT as value
			FROM note_game_entries
			WHERE user_id = $1
			GROUP BY date_trunc('day', created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, userID)
	} else {
		// language: sql
		query = `
			SELECT
				date_trunc($1, created_date) as timestamp,
				COUNT(*)::FLOAT as value
			FROM note_game_entries
			WHERE user_id = $2
			  AND created_date >= CURRENT_DATE - INTERVAL '1 day' * $3
			GROUP BY date_trunc($1, created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, interval, userID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	// Return empty array if no data (not an error)
	if data == nil {
		return []dtos.ChartDataPoint{}, nil
	}

	return data, nil
}

// fetchTotalQuestionsData retrieves total questions answered for a user
// Sums all questions per time interval
func fetchTotalQuestionsData(userID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	// For "all" interval, aggregate by day with no date constraint
	if interval == "all" {
		// language: sql
		query = `
			SELECT
				date_trunc('day', created_date) as timestamp,
				SUM(total_questions)::FLOAT as value
			FROM note_game_entries
			WHERE user_id = $1
			GROUP BY date_trunc('day', created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, userID)
	} else {
		// language: sql
		query = `
			SELECT
				date_trunc($1, created_date) as timestamp,
				SUM(total_questions)::FLOAT as value
			FROM note_game_entries
			WHERE user_id = $2
			  AND created_date >= CURRENT_DATE - INTERVAL '1 day' * $3
			GROUP BY date_trunc($1, created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, interval, userID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	// Return empty array if no data (not an error)
	if data == nil {
		return []dtos.ChartDataPoint{}, nil
	}

	return data, nil
}

// fetchTeacherNPMData retrieves aggregated NPM data for all students of a teacher
// Aggregates across all students linked via teacher_student table
func fetchTeacherNPMData(teacherID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	// For "all" interval, aggregate by day with no date constraint
	if interval == "all" {
		// language: sql
		query = `
			SELECT
				date_trunc('day', nge.created_date) as timestamp,
				AVG(nge.notes_per_minute)::FLOAT as value
			FROM note_game_entries nge
			INNER JOIN teacher_student ts ON nge.user_id = ts.student_id
			WHERE ts.teacher_id = $1
			GROUP BY date_trunc('day', nge.created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, teacherID)
	} else {
		// language: sql
		query = `
			SELECT
				date_trunc($1, nge.created_date) as timestamp,
				AVG(nge.notes_per_minute)::FLOAT as value
			FROM note_game_entries nge
			INNER JOIN teacher_student ts ON nge.user_id = ts.student_id
			WHERE ts.teacher_id = $2
			  AND nge.created_date >= CURRENT_DATE - INTERVAL '1 day' * $3
			GROUP BY date_trunc($1, nge.created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, interval, teacherID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	// Return empty array if no data (not an error)
	if data == nil {
		return []dtos.ChartDataPoint{}, nil
	}

	return data, nil
}

// fetchTeacherAccuracyData retrieves aggregated accuracy data for all students of a teacher
func fetchTeacherAccuracyData(teacherID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	// For "all" interval, aggregate by day with no date constraint
	if interval == "all" {
		// language: sql
		query = `
			SELECT
				date_trunc('day', nge.created_date) as timestamp,
				(SUM(nge.correct_questions)::FLOAT / NULLIF(SUM(nge.total_questions)::FLOAT, 0)) * 100 as value
			FROM note_game_entries nge
			INNER JOIN teacher_student ts ON nge.user_id = ts.student_id
			WHERE ts.teacher_id = $1
			GROUP BY date_trunc('day', nge.created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, teacherID)
	} else {
		// language: sql
		query = `
			SELECT
				date_trunc($1, nge.created_date) as timestamp,
				(SUM(nge.correct_questions)::FLOAT / NULLIF(SUM(nge.total_questions)::FLOAT, 0)) * 100 as value
			FROM note_game_entries nge
			INNER JOIN teacher_student ts ON nge.user_id = ts.student_id
			WHERE ts.teacher_id = $2
			  AND nge.created_date >= CURRENT_DATE - INTERVAL '1 day' * $3
			GROUP BY date_trunc($1, nge.created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, interval, teacherID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	// Return empty array if no data (not an error)
	if data == nil {
		return []dtos.ChartDataPoint{}, nil
	}

	return data, nil
}

// fetchTeacherSessionCountData retrieves aggregated session count for all students of a teacher
func fetchTeacherSessionCountData(teacherID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	// For "all" interval, aggregate by day with no date constraint
	if interval == "all" {
		// language: sql
		query = `
			SELECT
				date_trunc('day', nge.created_date) as timestamp,
				COUNT(*)::FLOAT as value
			FROM note_game_entries nge
			INNER JOIN teacher_student ts ON nge.user_id = ts.student_id
			WHERE ts.teacher_id = $1
			GROUP BY date_trunc('day', nge.created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, teacherID)
	} else {
		// language: sql
		query = `
			SELECT
				date_trunc($1, nge.created_date) as timestamp,
				COUNT(*)::FLOAT as value
			FROM note_game_entries nge
			INNER JOIN teacher_student ts ON nge.user_id = ts.student_id
			WHERE ts.teacher_id = $2
			  AND nge.created_date >= CURRENT_DATE - INTERVAL '1 day' * $3
			GROUP BY date_trunc($1, nge.created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, interval, teacherID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	// Return empty array if no data (not an error)
	if data == nil {
		return []dtos.ChartDataPoint{}, nil
	}

	return data, nil
}

// fetchTeacherTotalQuestionsData retrieves aggregated total questions for all students of a teacher
func fetchTeacherTotalQuestionsData(teacherID int, interval string, days int) ([]dtos.ChartDataPoint, error) {
	var query string
	var data []dtos.ChartDataPoint
	var err error

	// For "all" interval, aggregate by day with no date constraint
	if interval == "all" {
		// language: sql
		query = `
			SELECT
				date_trunc('day', nge.created_date) as timestamp,
				SUM(nge.total_questions)::FLOAT as value
			FROM note_game_entries nge
			INNER JOIN teacher_student ts ON nge.user_id = ts.student_id
			WHERE ts.teacher_id = $1
			GROUP BY date_trunc('day', nge.created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, teacherID)
	} else {
		// language: sql
		query = `
			SELECT
				date_trunc($1, nge.created_date) as timestamp,
				SUM(nge.total_questions)::FLOAT as value
			FROM note_game_entries nge
			INNER JOIN teacher_student ts ON nge.user_id = ts.student_id
			WHERE ts.teacher_id = $2
			  AND nge.created_date >= CURRENT_DATE - INTERVAL '1 day' * $3
			GROUP BY date_trunc($1, nge.created_date)
			ORDER BY timestamp ASC
		`
		err = database.DBClient.Select(&data, query, interval, teacherID, days)
	}

	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}

	// Return empty array if no data (not an error)
	if data == nil {
		return []dtos.ChartDataPoint{}, nil
	}

	return data, nil
}
