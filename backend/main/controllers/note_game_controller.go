package controllers

import (
	"errors"
	"net/http"
	dtos "sight-reading/DTOs"
	"sight-reading/middleware"
	"sight-reading/services"

	"github.com/gin-gonic/gin"
)

// SetupNoteGameRoutes initializes all note game routes
func SetupNoteGameRoutes(router *gin.Engine) {
	noteGame := router.Group("/api/note-game")
	noteGame.Use(middleware.AuthMiddleware())
	{
		noteGame.POST("/entry", CreateNoteGameEntry)
	}
}

// CreateNoteGameEntry saves a new note game entry for a user
// Protected: Requires JWT authentication
func CreateNoteGameEntry(c *gin.Context) {
	userIDInterface, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	authenticatedUserID, ok := userIDInterface.(int)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid user ID"})
		return
	}

	var entry dtos.Entry
	if err := c.ShouldBindJSON(&entry); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	entryID, err := services.CreateNoteGameEntry(authenticatedUserID, &entry)
	if err != nil {
		if errors.Is(err, services.ErrUnauthorized) {
			c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Note game entry saved successfully",
		"id":      entryID,
	})
}
