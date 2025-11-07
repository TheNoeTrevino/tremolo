package services

import (
	"net/http"
	"sight-reading/database"
	"strconv"

	dtos "sight-reading/DTOs"

	"github.com/gin-gonic/gin"
)

func CreateUser(c *gin.Context) {
	var reqBody dtos.User

	err := c.ShouldBindJSON(&reqBody)
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":    true,
			"message":  "Invalid json body",
			"scenario": "TS.1",
		})
		return
	}

	err = reqBody.ValidateUser()
	if err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"error":    reqBody.ValidateUser().Error(),
			"message":  "Information invalid",
			"scenario": "TS.2",
		})
		return
	}

	// language: sql
	query := `
  INSERT INTO users (
    first_name,
    last_name,
    school_id,
    role
  )
  VALUES (
    :first_name,
    :last_name,
    :school_id,
    :role
  )
  RETURNING
    first_name,
    last_name,
    role,
    school_id
  `

	// TODO: dont get confused here, just add the role to the request body in the
	// front end
	//
	// rows contains all the 'returning values'
	rows, err := database.DBClient.NamedQuery(query, reqBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    err.Error(),
			"message":  "The school is most likely not found",
			"scenario": "TS.3",
		})
		return
	}

	var teacherValidation dtos.User

	// in this case, we just have one, but when wanting to do a multitude of
	// entities this works the same
	// iterates through all the rows returned, and maps to a struct
	if rows.Next() {
		err := rows.StructScan(&teacherValidation)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":    err.Error(),
				"help":     "this is at the database level",
				"scenario": "TS.4",
			})
			return
		}
	}

	err = rows.Close()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":    err.Error(),
			"help":     "this is at the database level. ",
			"scenario": "TS.5",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"body":   teacherValidation,
		"status": "teacher created sucessfully",
	})
}

// TODO:
func UpdateTeacher(c *gin.Context) {
}

func GetStudents(c *gin.Context) {
	// language: sql
	query := `
  SELECT first_name, last_name, role, school_id
  FROM users
  WHERE role = 'STUDENT'  
  `

	var students []dtos.User

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

	// language: sql
	query := `
  SELECT first_name, last_name, role, school_id
  FROM users
  WHERE role = 'STUDENT'
  AND id = $1
  `

	var students dtos.User

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
