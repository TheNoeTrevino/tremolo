package controllers

import (
	"sight-reading/services"

	"github.com/gin-gonic/gin"
)

func SetupTeacherRoutes(router *gin.Engine) {
	router.POST("/teacher", services.CreateTeacher)
	router.GET("/students", services.GetStudents)
	router.GET("/students/:id", services.GetStudent)
	// router.POST("/:id", services.GetEntries)
}
