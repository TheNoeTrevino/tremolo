package dtos

import (
	"errors"
	"strings"

	"github.com/go-playground/validator/v10"
)

type User struct {
	ID          *int16 `db:"id"           json:"id"`
	FirstName   string `db:"first_name"   json:"first_name"   validate:"required,alpha"`
	LastName    string `db:"last_name"    json:"last_name"    validate:"required,alpha"`
	Role        Role   `db:"role"         json:"role"         validate:"required,role"` // TODO: add custom validation to only have teacher...
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

// youtube custom validation
func validateUserRole(fl validator.FieldLevel) bool {
	switch fl.Field().String() {
	case "TEACHER", "STUDENT", "ADMIN":
		return true
	}

	return false
}

// TODO: append every error to a slice of errors, return that
func (user *User) ValidateUser() error {
	validate := validator.New()
	validate.RegisterValidation("role", validateUserRole)

	err := validate.Struct(user)
	if err != nil {
		var errorMessage []string
		if errs, ok := err.(validator.ValidationErrors); ok {
			for _, fieldErr := range errs {
				switch fieldErr.StructField() {

				case "FirstName":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "First name is required")
					case "alpha":
						errorMessage = append(errorMessage, "First name must be only alphabetical charaters")
					}

				case "LastName":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "Last name is required")
					case "alpha":
						errorMessage = append(errorMessage, "Last name must be only alphabetical charaters")
					}

				case "Role":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "Role is required when making a user")
					case "role":
						errorMessage = append(errorMessage, "Role must be either STUDENT, TEACHER, or ADMIN")
					}
				}
			}
		}
		return errors.New(strings.Join(errorMessage, ",/n"))
	}
	return nil
}
