package tests

import (
	dtos "sight-reading/DTOs"
	"testing"
)

// TODO: validate the error messages
// Happy path
func TestHappyUserCheckValidation(t *testing.T) {
	user := &dtos.User{
		FirstName: "Noe",
		LastName:  "Trevino",
		Role:      "TEACHER",
	}

	err := user.ValidateUser()
	if err != nil {
		t.Fatal(err)
	}
}

func TestHappyEntryCheckValidation(t *testing.T) {
	entry := &dtos.Entry{
		TimeLength:       "01:30:30",
		Questions:        12,
		CorrectQuestions: 11,
		UserID:           4,
	}

	err := entry.ValidateEntry()
	if err != nil {
		t.Fatal(err)
	}
}

func TestHappyDistrictCheckValidation(t *testing.T) {
	district := &dtos.District{
		Title:   "Byron Nelson High School",
		County:  "Denton",
		State:   "Texas",
		Country: "USA",
	}

	err := district.ValidateDistrict()
	if err != nil {
		t.Fatal(err)
	}
}

// Sad path
func TestSadUserCheckValidation(t *testing.T) {
	user := &dtos.User{
		FirstName: "Noe1",
		LastName:  "Trevino12",
		Role:      "STUDEN",
	}

	err := user.ValidateUser()
	if err == nil {
		t.Fatal("There are no errors dectected")
	} else {
		t.Logf("Failed as expected: %v", err)
	}
}

func TestSadEntryCheckValidation(t *testing.T) {
	entry := &dtos.Entry{
		TimeLength:       "29:30:90",
		Questions:        12,
		CorrectQuestions: 19,
		UserID:           4,
	}
	err := entry.ValidateEntry()
	if err == nil {
		t.Fatal("There are no errors dectected, this is a sad path")
	} else {
		t.Logf("Failed as expected: %v", err)
	}
}

func TestSadDistrictCheckValidation(t *testing.T) {
	district := &dtos.District{
		// Title:   "Byron Nelson High School",
		// County:  "Denton",
		// State:   "Texas",
		Country: "USA",
	}

	err := district.ValidateDistrict()
	if err == nil {
		t.Fatal("There are no errors dectected, this is a sad path")
	} else {
		t.Logf("Failed as expected: %v", err)
	}
}
