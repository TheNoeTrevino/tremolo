# Tremolo

## Goal

I want to make a one stop shop where educators can send students to practice their specific music, sight reading, and much more.

This project is deigned for music students 6th through 12th in public school.

This also be a technical exercise for myself as I will be learning a huge amount of things on the way.

## Current Progress:

https://github.com/user-attachments/assets/63a7100e-a79c-4aca-be35-3089c9ec1d7d

## Run the Project Locally

### Environment Setup

``` bash
  export DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
  export DATABASE_USER="<username>"
  export DATABASE_PW="<password>"

  export VITE_BACKEND_MAIN="http://localhost:5001" # default local setup
  export VITE_BACKEND_MUSIC="http://localhost:8000" # default local setup
```

### Serve it locally

> [!NOTE]
> For each terminal, you must ensure you have the environment variables set in
> order for the services to communicate with each other.

#### Frontend

``` bash
cd frontend

npm install && npm run dev
```

#### Music generation microservice

TODO: put deps in requirements.txt

``` bash

cd backend/music

python3 -m venv env

source env/bin/activate

pip install -r requirements.txt

python3 manage.py migrate

python3 manage.py runserver

```

#### User tracking microservice


``` bash

cd backend/main
go run main.go

```

#### Scripts

Install dependencies script, nice if you use worktrees/different directories:

``` bash
chmod +x ./scripts/install-deps.sh
./scripts/install-deps.sh
```

TODO: add tmux script we made


## Technologies used:

### Frontend

React

TypeScript

Material UI - Beautiful UI components

OpenSheetMusicDisplay - Display the musical files on the web browser

### Backend

Music21 - Generate the midi and xml files as needed

Django - Complementing the music21 library very well. Used for the music generations microservice.

Go - sqlx for database interaction and mapping to structs, playground validator for validations. Used for the user tracking microservice
