package dtos

import (
	"errors"
	"sight-reading/validations"
	"strings"

	"github.com/go-playground/validator/v10"
)

type User struct {
	ID          *int16 `db:"id"           json:"id"`
	FirstName   string `db:"first_name"   json:"first_name"   validate:"required,alpha,len255"`
	LastName    string `db:"last_name"    json:"last_name"    validate:"required,alpha,len255"`
	Role        Role   `db:"role"         json:"role"         validate:"required,role"`
	CreatedDate string `db:"created_date" json:"created_date"`
	DistrictID  int16  `db:"district_id"  json:"district_id"`
}

type Role string

const (
	Admin   Role = "ADMIN"
	Teacher Role = "TEACHER"
	Parent  Role = "PARENT"
	Student Role = "STUDENT"
)

func (user *User) ValidateUser() error {
	validate := validator.New()
	validate.RegisterValidation("role", validations.UserRole)
	validate.RegisterValidation("len255", validations.VarChar255Length)

	err := validate.Struct(user)
	if err != nil {
		var errorMessage []string
		if errs, ok := err.(validator.ValidationErrors); ok {
			for _, fieldErr := range errs {
				switch fieldErr.StructField() {

				case "FirstName":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "FirstName: first name is required")
					case "alpha":
						errorMessage = append(errorMessage, "FirstName: must be only alphabetical charaters")
					case "len255":
						errorMessage = append(errorMessage, "FirstName: must be shorter than 255 characters")
					}

				case "LastName":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "LastName: last name is required")
					case "alpha":
						errorMessage = append(errorMessage, "LastName: must be only alphabetical charaters")
					case "len255":
						errorMessage = append(errorMessage, "LastName: must be shorter than 255 characters")
					}

				case "Role":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "Role: required when making a user")
					case "role":
						errorMessage = append(errorMessage, "Role: must be either STUDENT, TEACHER, or ADMIN")
					}
				}
			}
		}
		return errors.New(strings.Join(errorMessage, ",\n"))
	}
	return nil
}