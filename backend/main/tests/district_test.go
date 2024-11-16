package tests

import (
	dtos "sight-reading/DTOs"
	"strings"
	"testing"
)

// NOTE: Happy path
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

// NOTE: Sad path
func TestSadDistrictCheckValidation(t *testing.T) {
	district := &dtos.District{
		Title: strings.Repeat("Foo", 100),
		// County:  "Denton",
		State:   "Texas",
		Country: "USA",
	}

	err := district.ValidateDistrict()
	if err == nil {
		t.Fatal("There are no errors dectected, this is a sad path")
	} else {
		t.Logf("Failed as expected: %v", err)
	}
}
