package controllers

import (
	"sight-reading/services"

	"github.com/gin-gonic/gin"
)

func SetupTeacherRoutes(router *gin.Engine) {
	router.POST("/", services.CreatePost)
	router.GET("/", services.GetPosts)
	router.GET("/:id", services.GetPost)
	router.POST("/:id", services.GetPost)
}
