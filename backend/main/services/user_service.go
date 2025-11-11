package services

import (
	"net/http"
	"sight-reading/repositories"

	dtos "sight-reading/DTOs"

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

	noteGameRepo := repositories.NewNoteGameRepository()

	entry := repositories.NoteGameEntry{
		UserID:           int(reqBody.UserID),
		TimeLength:       reqBody.TimeLength,
		TotalQuestions:   int(reqBody.TotalQuestions),
		CorrectQuestions: int(reqBody.CorrectQuestions),
		NotesPerMinute:   float64(reqBody.NPM),
	}

	entryID, err := noteGameRepo.CreateNoteGameEntry(entry)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"body":    reqBody,
		"post_id": entryID,
		"error":   false,
	})
}

func GetEntriesByUserId(c *gin.Context) {
	noteGameRepo := repositories.NewNoteGameRepository()

	entries, err := noteGameRepo.GetEntriesByUserID(1)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   err.Error(),
			"message": "Invalid request body",
		})
		return
	}

	var dtoEntries []dtos.Entry
	for _, entry := range entries {
		dtoEntry := dtos.Entry{
			UserID:           int16(entry.UserID),
			TimeLength:       entry.TimeLength,
			TotalQuestions:   int16(entry.TotalQuestions),
			CorrectQuestions: int16(entry.CorrectQuestions),
			NPM:              int8(entry.NotesPerMinute),
		}
		dtoEntries = append(dtoEntries, dtoEntry)
	}

	c.JSON(http.StatusOK, dtoEntries)
}
