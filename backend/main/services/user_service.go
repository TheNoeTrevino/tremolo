package services

import (
	"net/http"
	"sight-reading/database"
	"sight-reading/models"

	"github.com/gin-gonic/gin"
)

func CreateNoteGameEntry(c *gin.Context) {
	var reqBody models.Entry

	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   err.Error(),
			"message": "Invalid request body for entry",
		})
		return
	}

	// NOTE: db check passed
	query := `
  INSERT INTO note_game_entries (
    user_id,
    time_length,
    total_questions,
    correct_questions,
    notes_per_minute
  )
  VALUES (
    :user_id
    :time_length,
    :total_questions,
    :correct_questions,
  )
  RETURNING id, user_id
  `

	rows, err := database.DBClient.NamedQuery(query, reqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var entryID int64
	if rows.Next() {
		rows.Scan(&entryID)
	}
	rows.Close()

	c.JSON(http.StatusCreated, gin.H{
		"body":    reqBody,
		"post_id": entryID,
		"error":   false,
	})
}

func GetEntriesByUserId(c *gin.Context) {
	// NOTE: db check passed
	// TODO: specify columns
	query := `
  SELECT *
  FROM entries
  where entries.user_id = $1
  `
}
