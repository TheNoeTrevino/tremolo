package services

import (
	"net/http"
	dtos "sight-reading/DTOs"
	"sight-reading/database"

	"github.com/gin-gonic/gin"
)

func CreateNoteGameEntry(c *gin.Context) {
	var reqBody dtos.Entry

	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   err.Error(),
			"message": "Invalid json",
		})
		return
	}

	err = reqBody.ValidateEntry()
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
	var entries []dtos.Entry
	err := database.DBClient.Select(entries, query, 1)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   err.Error(),
			"message": "Invalid request body",
		})
		return
	}

	c.JSON(http.StatusOK, entries)
}

// TODO: make sure this is taking in and looking for the id param, havent
// checked yet
func IsUser(c *gin.Context) {
	username := c.Param("username")
	// password := c.Param("password")

	query := `
  SELECT id from users
  WHERE (username = $1 OR email = $1)
  `
	// AND password = $2
	var user dtos.User

	err := database.DBClient.Get(&user, query, username)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"isUser": false,
			"error":  "User is not found",
		})
		return
	} else {
		c.JSON(http.StatusOK, gin.H{
			"isUser": true,
			"error":  false,
		})
	}
}
