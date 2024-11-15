package services

import (
	"net/http"
	"sight-reading/database"
	"sight-reading/models"
	dtos "sight-reading/models/DTOs"
	"strconv"

	"github.com/gin-gonic/gin"
)

// created successful, fix validation
func CreateUser(c *gin.Context) {
	var reqBody models.User

	// validates that the json is valid
	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	err = reqBody.ValidateUser()
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": reqBody.ValidateUser().Error(),
		})
		return
	}

	query := `
  INSERT INTO users (
    first_name,
    last_name,
    district_id,
    role
  )
  VALUES (
    :first_name,
    :last_name,
    :district_id,
    :role
  )
  RETURNING
    first_name,
    last_name,
    role,
    district_id
  `

	// TODO: dont get confused here, just add the role to the request body in the
	// front end
	//
	// rows contains all the 'returning values'
	rows, err := database.DBClient.NamedQuery(query, reqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var teacherValidation dtos.UserDTO

	// in this case, we just have one, but when wanting to do a multitude of
	// entities this works the same
	// iterates through all the rows returned, and maps to a struct
	if rows.Next() {
		err := rows.StructScan(&teacherValidation)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error": err.Error(),
				"help":  "this is at the database level",
			})
			return
		}
	}

	rows.Close()

	c.JSON(http.StatusCreated, gin.H{
		"body":   teacherValidation,
		"status": "teacher created sucessfully",
	})
}

// TODO:
func UpdateTeacher(c *gin.Context) {
}

// postman passed
func GetStudents(c *gin.Context) {
	query := `
  SELECT first_name, last_name, role, district_id
  FROM users
  WHERE role = 'STUDENT'  
  `
	// WHERE users.role = 'STUDENT'

	var students []dtos.UserDTO

	err := database.DBClient.Select(&students, query)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   err.Error(),
			"message": "not updated",
		})
		return
	}
	c.JSON(http.StatusOK, students)
}

// postman passed
func GetStudent(c *gin.Context) {
	idSrt := c.Param("id")
	id, err := strconv.Atoi(idSrt)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":   true,
			"message": "Invalid request body",
		})
		return
	}

	// the and of this is not right
	query := `
  SELECT first_name, last_name, role, district_id
  FROM users
  WHERE users.role = 'STUDENT'
  AND users.id = $1
  `

	var students models.User

	err = database.DBClient.Get(&students, query, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   err.Error(),
			"message": "not found",
		})
		return
	}
	c.JSON(http.StatusOK, students)
}
