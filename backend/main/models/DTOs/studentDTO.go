package dtos

type UserDTO struct {
	FirstName  string  `db:"first_name" json:"first_name" validate:"required"`
	LastName   string  `db:"last_name" json:"last_name" validate:"required"`
	Role       *string `db:"role" json:"role" validate:"required"`
	DistrictID int16   `db:"district_id" json:"district_id"`
}
