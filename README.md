# Tremolo

## Goal

I want a one stop shop where educators can send students to practice their specific music, sight reading, and much more.

This project is deigned for music students 6th through 12th in public school. 

This also be a technical exercise for myself as I will be learning a huge amount of things on the way.

## Current Progress:


https://github.com/user-attachments/assets/63a7100e-a79c-4aca-be35-3089c9ec1d7d

## Install
`cd frontend`

`npm install && npm run dev`

`cd backend`

`python3 -m venv env`

`pip install django djangorestframework django-cors-headers music21`

`python3 main/manage.py migrate && runserver`

## Technologies used:

### Frontend

React

TypeScript

Material UI - Beautiful UI components

OpenSheetMusicDisplay - Display the musical files on the web browser

### Backend

Music21 - Generate the midi and xml files as needed

Django - Complementing the music21 library very well

...planning on adding java for database interaction and user authentication, and keeping progress of user stats
