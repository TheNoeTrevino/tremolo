package database

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DBClient *sqlx.DB

func InitializeDBConnection() {
	db, err := sqlx.Open("postgres", "postgres://postgres:@localhost:5432/tremolo?sslmode=disable")
	if err != nil {
		panic(err.Error())
	}

	err = db.Ping()
	if err != nil {
		panic(err.Error())
	}

	DBClient = db
}
