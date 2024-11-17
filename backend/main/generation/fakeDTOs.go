package generation

type District struct {
	// ID      *int16 `db:"id"      json:"id"`
	Title   string
	County  string
	State   string
	Country string
}

type User struct {
	// ID          *int16
	FirstName   string
	LastName    string
	Role        string
	CreatedDate string
	DistrictID  int16
}

type Entry struct {
	// ID               *int16
	TimeLength       string
	Questions        int16
	CorrectQuestions int16
	UserID           int16
}
