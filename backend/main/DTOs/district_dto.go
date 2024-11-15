package dtos

import (
	"errors"
	"strings"

	"github.com/go-playground/validator/v10"
)

type District struct {
	ID      *int16 `db:"id"      json:"id"`
	Title   string `db:"title"   json:"title"    validate:"required,alphanum"`
	County  string `db:"county"  json:"county"   validate:"required,alpha"`
	State   string `db:"state"   json:"state"    validate:"required,alpha"`
	Country string `db:"country" json:"country"  validate:"required,alpha"`
}

// TODO: add varchar constraints
func (district *District) ValidateDistrict() error {
	validate := validator.New()
	validate.RegisterValidation("time", validateEntryTimeLength)

	err := validate.Struct(district)
	if err != nil {
		var errorMessage []string
		if errs, ok := err.(validator.ValidationErrors); ok {
			for _, fieldErr := range errs {
				switch fieldErr.StructField() {

				case "Title":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "Title: title is required")
					case "alphanum":
						errorMessage = append(errorMessage, "Title: title must be alphanumeric")
					}

				case "County":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "County amount is required")
					case "alpha":
						errorMessage = append(errorMessage, "County: title must be alpha")
					}

				case "State":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "State questions are required")
					case "alpha":
						errorMessage = append(errorMessage, "State: title must be alpha")
					}

				case "Country":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "Country is required")
					case "alpha":
						errorMessage = append(errorMessage, "Country: title must be alpha")
					}
				}
			}
		}
		if len(errorMessage) > 0 {
			return errors.New(strings.Join(errorMessage, ",\n"))
		}
	}
	return nil
}
