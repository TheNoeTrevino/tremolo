package tests

import (
	"sight-reading/models"
	"testing"
)

// TODO: validate the error messages
// Happy path
func TestHappyCheckValidation(t *testing.T) {
	user := &models.User{
		FirstName: "Noe",
		LastName:  "Trevino",
		Role:      "TEACHER",
	}

	err := user.ValidateUser()
	if err != nil {
		t.Fatal(err)
	}
}

// Sad path
func TestSadCheckValidation(t *testing.T) {
	user := &models.User{
		FirstName: "Noe",
		LastName:  "Trevino",
		Role:      "STUDEN",
	}

	err := user.ValidateUser()
	if err == nil {
		t.Fatal(err)
	} else {
		t.Logf("failed as expected: %v", err)
	}
}
