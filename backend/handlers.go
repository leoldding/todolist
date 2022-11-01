package main

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"log"
	"net/http"
	"time"
)

type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func ping(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "pong")
	return
}

func signup(w http.ResponseWriter, r *http.Request) {
	var creds Credentials

	// retrieve and bind credentials from json
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		log.Printf("JSON decode error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// check if username exists in database
	var count int
	row := postgres.QueryRow("SELECT COUNT(*) FROM users WHERE username = $1;", creds.Username)
	err = row.Scan(&count)
	if err != nil {
		log.Printf("Postgres username query error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if count != 0 {
		log.Printf("User exists already!")
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// create password hash
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 8)
	if err != nil {
		log.Printf("Password hash generation error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// insert new user into database
	_, err = postgres.Exec("INSERT INTO users(username, password) VALUES ($1, $2)", creds.Username, hashedPassword)
	if err != nil {
		log.Printf("User insertion error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	return
}

func login(w http.ResponseWriter, r *http.Request) {
	var creds Credentials

	// retrieve and bind credentials from json
	err := json.NewDecoder(r.Body).Decode(&creds)
	if err != nil {
		log.Printf("JSON decode error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// retrieve the stored password hash based on given username
	var password []byte
	row := postgres.QueryRow("SELECT password FROM users WHERE username = $1;", creds.Username)
	err = row.Scan(&password)
	if err != nil {
		log.Printf("User doesn't exist: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// compare stored hash and inputted password
	err = bcrypt.CompareHashAndPassword(password, []byte(creds.Password))
	if err != nil {
		log.Printf("Password hashes don't match: %v", err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// create session token
	sessionToken := uuid.New().String()
	expiresAt := time.Now().Add(5 * time.Minute)

	// insert session token values into database
	_, err = postgres.Exec("INSERT INTO sessions(sessionname, username, expiration) VALUES ($1, $2, $3)", sessionToken, creds.Username, expiresAt)
	if err != nil {
		log.Printf("Postgres insert session error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// set cookie
	http.SetCookie(w, &http.Cookie{
		Name:    "sessionToken",
		Value:   sessionToken,
		Expires: expiresAt,
	})

	return
}

func logout(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "logging out")
	return
}
