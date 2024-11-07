package controllers

import (
	"sight-reading/services"

	"github.com/gin-gonic/gin"
)

func SetupTeacherRoutes(router *gin.Engine) {
	router.POST("/", services.CreateTeacher)
	router.GET("/", services.GetStudents)
	router.GET("/:id", services.GetStudent)
	router.POST("/:id", services.GetEntried)
}
