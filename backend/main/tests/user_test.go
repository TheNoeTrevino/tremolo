package tests

import (
	dtos "sight-reading/DTOs"
	"strings"
	"testing"
)

// NOTE: Happy path
func TestHappyUserCheckValidation(t *testing.T) {
	user := &dtos.User{
		FirstName: "Noe",
		LastName:  "Trevino",
		Role:      "TEACHER",
		Email:     "noe.trevino@mail.com",
		SchoolID:  19,
	}

	err := user.ValidateUser()
	if err != nil {
		t.Fatal(err)
	}
}

// NOTE: Sad path
func TestSadUserCheckValidation(t *testing.T) {
	user := &dtos.User{
		FirstName: strings.Repeat("Foo1", 100),
		LastName:  strings.Repeat("Foo", 100),
		Role:      "STUDEN",
	}

	err := user.ValidateUser()
	if err == nil {
		t.Fatal("There are no errors dectected")
	} else {
		t.Logf("Failed as expected: %v", err)
	}
}
