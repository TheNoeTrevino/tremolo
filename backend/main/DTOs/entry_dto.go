package dtos

import (
	"errors"
	"regexp"
	"strings"

	"github.com/go-playground/validator/v10"
)

type Entry struct {
	ID               *int16 `db:"id"         json:"id"`
	TimeLength       string `db:"length"     json:"length"            validate:"required,time"`
	Questions        int16  `db:"questions"  json:"total_questions"   validate:"required"`
	CorrectQuestions int16  `db:"correct"    json:"correct_questions" validate:"required"`
	UserID           int16  `db:"user_id"    json:"user_id"           validate:"required"`
}

// TODO: i think there a way make this more appropriate for when has a 2 at the
// beginning
// TODO: make a validation for correct lte total questions
func validateEntryTimeLength(fl validator.FieldLevel) bool {
	r := regexp.MustCompile("[0-2][0-9]:[0-5][0-9]:[0-5][0-9]")
	// why -1?
	matches := r.FindAllString(fl.Field().String(), -1)

	if len(matches) != 1 {
		return false
	} else {
		return true
	}
}

func (entry *Entry) ValidateEntry() error {
	validate := validator.New()
	validate.RegisterValidation("time", validateEntryTimeLength)

	err := validate.Struct(entry)
	if err != nil {
		var errorMessage []string

		if entry.CorrectQuestions > entry.Questions {
			errorMessage = append(errorMessage, "Correct questions cannot be more than total questions")
		}

		if errs, ok := err.(validator.ValidationErrors); ok {
			for _, fieldErr := range errs {
				switch fieldErr.StructField() {

				case "TimeLength":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "Time length is required")
					case "time":
						errorMessage = append(errorMessage, "Time must be in the 12:59:59 format")
					}

				case "Questions":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "Question amount is required")
					}

				case "CorrectQuestions":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "Correct questions are required")
					}

				case "UserID":
					switch fieldErr.Tag() {
					case "required":
						errorMessage = append(errorMessage, "UserID is required")
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
