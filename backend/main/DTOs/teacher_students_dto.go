package dtos

type TeacherStudents struct {
	FirstName string `db:"first_name" json:"firstName"`
	LastName  string `db:"last_name"  json:"lastName"`
	Students  []User `                json:"students"`
}
