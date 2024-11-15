package services

import (
	"net/http"
	"sight-reading/database"
	"sight-reading/models"
	dtos "sight-reading/models/DTOs"
	"strconv"

	"github.com/gin-gonic/gin"
)

// postgres passed
func GetTeachers(c *gin.Context) {
	query := `
  SELECT first_name, last_name, role, district_id
  FROM users
  WHERE role = 'TEACHER'  
  `
	// WHERE users.role = 'STUDENT'

	var students []dtos.UserDTO

	err := database.DBClient.Select(&students, query)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   err.Error(),
			"message": "not able to get all the teachers",
		})
		return
	}
	c.JSON(http.StatusOK, students)
}

func GetTeacher(c *gin.Context) {
	idSrt := c.Param("id")
	id, err := strconv.Atoi(idSrt)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	var post models.User

	// association table here
	query := `
  SELECT id, first_name, last_name
  FROM users
  WHERE id = $1;
  `
	err = database.DBClient.Get(&post, query, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   true,
			"message": "not found",
		})
		return
	}
	c.JSON(http.StatusOK, post)
}

func GetDistrictTeachers(c *gin.Context) {
	// i think this is going to be some sort of left join
	query := `
  SELECT id, firsname, lastname
  FROM users
  WHERE users.districtID = $1
  AND user.role = 'TEACHER'
  `

	var teachers []dtos.UserDTO

	err := database.DBClient.Select(&teachers, query)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   err.Error(),
			"message": "not able to get all the teachers",
		})
		return
	}

	c.JSON(http.StatusOK, teachers)
}

func GetDistrictStudents(c *gin.Context) {
	query := `
  SELECT id, firsname, lastname
  FROM users
  WHERE users.districtID = $1
  AND user.role = 'STUDENT'
  `

	var students []dtos.UserDTO

	err := database.DBClient.Select(&students, query)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   err.Error(),
			"message": "not able to get all the teachers",
		})
		return
	}

	c.JSON(http.StatusOK, students)
}
