package services

import (
	"net/http"
	"sight-reading/database"
	"sight-reading/models"

	"github.com/gin-gonic/gin"
)

func CreateEntry(c *gin.Context) {
	var reqBody models.Entry

	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   err.Error(),
			"message": "Invalid request body for entry",
		})
		return
	}

	query := `
  INSERT INTO entries (
    created_at,
    length,
    total_questions,
    correct_questions,
    first_name,
    last_name,
    user_id
  )
  VALUES (
    :created_at,
    :length,
    :total_questions,
    :correct_questions,
    :first_name,
    :last_name,
    :user_id
  )
  RETURNING id
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

func GetEntries(c *gin.Context) {
	query := `
  SELECT *
  FROM entries
  where userId = $1
  `
}

func GetEntry(c *gin.Context) {
	query := `
  SELECT *
  FROM entries
  where ...
  `
}
