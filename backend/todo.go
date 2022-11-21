package main

import (
	"encoding/json"
	"log"
	"net/http"
)

type Task struct {
	Username    string `json:"user"`
	Description string `json:"task"`
}

func addTask(w http.ResponseWriter, r *http.Request) {
	var task Task

	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		log.Printf("JSON decode error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	_, err = postgres.Exec("INSERT INTO tasks(username, description) VALUES ($1, $2)", task.Username, task.Description)
	if err != nil {
		log.Printf("Task insertion error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	return
}
