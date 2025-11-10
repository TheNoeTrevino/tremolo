// Package services provides user information retrieval for profile displays
package services

import (
	"database/sql"
	"fmt"
	dtos "sight-reading/DTOs"
	"sight-reading/database"
	"sight-reading/logger"
)

// GetGeneralUserInfo fetches basic user information and aggregate statistics
// Returns user name, join date, total entries, and total practice time
func GetGeneralUserInfo(userID int) (*dtos.GeneralUserInfoDTO, error) {
	var userInfo dtos.GeneralUserInfo

	// Query to fetch user basic info and aggregate stats in a single query
	// Uses LEFT JOIN to handle users with no entries
	// SUM(time_length) returns PostgreSQL interval type which is converted to string
	// language: sql
	query := `
		SELECT
			u.first_name,
			u.last_name,
			u.created_date::TEXT as created_date,
			COALESCE(COUNT(nge.id), 0)::INT as total_entries,
			COALESCE(SUM(nge.time_length)::TEXT, '00:00:00') as total_duration
		FROM users u
		LEFT JOIN note_game_entries nge ON u.id = nge.user_id
		WHERE u.id = $1
		GROUP BY u.id, u.first_name, u.last_name, u.created_date
	`

	err := database.DBClient.Get(&userInfo, query, userID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("user not found with ID: %d", userID)
		}
		logger.Error("Failed to fetch general user info",
			"error", err.Error(),
			"user_id", userID)
		return nil, fmt.Errorf("failed to fetch user information: %w", err)
	}

	// Convert to DTO with formatted fields
	dto := userInfo.ToDTO()
	return &dto, nil
}
