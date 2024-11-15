package models

// TODO: the models are not really necessary since we are not using an orm,
// maybe we should switch all this in to just dtos instead

// TODO:
// custom validation to the roles, has to be in the enumeration
// var length according to the database, 255? for firstname, lastname, title
type District struct {
	ID      *int16 `db:"id"      json:"id"`
	Title   string `db:"title"   json:"title"    validate:"required"`
	County  string `db:"county"  json:"county"   validate:"required"`
	State   string `db:"state"   json:"state"    validate:"required"`
	Country string `db:"country" json:"country"  validate:"required"`
}

type User struct {
	ID         *int16 `db:"id"          json:"id"`
	FirstName  string `db:"first_name"  json:"first_name"  validate:"required"`
	LastName   string `db:"last_name"   json:"last_name"   validate:"required"`
	Role       Role   `db:"role"        json:"role"        validate:"required"`
	DistrictID int16  `db:"district_id" json:"district_id" validate:"required"`
}

type Entry struct {
	ID               *int16 `db:"id"         json:"id"`
	Length           *int64 `db:"length"     json:"length"            validate:"required"`
	Questions        *int16 `db:"questions"  json:"total_questions"   validate:"required"`
	CorrectQuestions *int16 `db:"correct"    json:"correct_questions" validate:"required"`
	FirstName        string `db:"first_name" json:"first_name"        validate:"required"`
	LastName         string `db:"last_name"  json:"last_name"         validate:"required"`
	UserID           int16  `db:"user_id"    json:"user_id"           validate:"required"`
}

type Role string

const (
	Admin   Role = "ADMIN"
	Teacher Role = "TEACHER"
	Parent  Role = "PARENT"
	Student Role = "STUDENT"
)

// TODO: make each model its own file so we can show the validations on each
// file. also make these return a custom error
//
// NOTE: these are all user validations
