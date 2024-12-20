package controllers

import (
	"sight-reading/services"

	"github.com/gin-gonic/gin"
)

func SetupTeacherRoutes(router *gin.Engine) {
	router.GET("/teachers", services.GetTeachers)
	router.GET("/teacher/:id", services.GetTeacher)
	router.GET("/students", services.GetStudents)
	router.GET("/student/:id", services.GetStudent)
	router.GET("/entries/:id", services.GetEntriesByUserId)
	router.POST("/entries", services.CreateNoteGameEntry)
	// i think this is wrong
	router.GET("/user/:username&:password", services.IsUser)
	router.POST("/user", services.CreateUser)
}
