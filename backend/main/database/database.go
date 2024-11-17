package database

import (
	"strings"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

var DBClient *sqlx.DB

func InitializeDBConnection() {
	db, err := sqlx.Open("postgres", "postgres://postgres:@localhost:5432/tremolo?sslmode=disable")
	if err != nil {
		panic(err.Error())
	} else {
		println(strings.Repeat("------------------------------", 2))
		println("\nConnected to database successfully\n")
		println(strings.Repeat("------------------------------", 2))
	}

	err = db.Ping()
	if err != nil {
		panic(err.Error())
	}

	DBClient = db
}
