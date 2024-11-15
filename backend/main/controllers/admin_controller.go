package controllers

import (
	"sight-reading/services"

	"github.com/gin-gonic/gin"
)

func SetupAdminRoutes(router *gin.Engine) {
	router.GET("/admin", services.GetTeachers)
	// router.GET("/admin/:id", services.GetDistrictTeachers)
	// router.POST("/admin/:id", services.GetDistrictStudents)
}
