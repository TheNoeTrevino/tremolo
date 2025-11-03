package controllers

import (
	"sight-reading/middleware"
	"sight-reading/services"

	"github.com/gin-gonic/gin"
)

func SetupAuthRoutes(router *gin.Engine) {
	auth := router.Group("/api/auth")
	{
		auth.POST("/login", services.Login)
		auth.POST("/register", services.Register)

		auth.GET("/me", middleware.AuthMiddleware(), services.GetCurrentUser)
	}
}
