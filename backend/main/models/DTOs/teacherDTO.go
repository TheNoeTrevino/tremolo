package dtos

type TeacherDTO struct {
	FirstName  string
	LastName   string
	DistrictID int16
	Students   []*TeacherStudentsDTO
}

type TeacherStudentsDTO struct {
	FirstName string
	LastName  string
	Entries   int16
}

type StudentDTO struct {
	FirstName string
	LastName  string
	Entries   int16
	Accuracy  float32
}
