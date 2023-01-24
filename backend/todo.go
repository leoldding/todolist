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

type ListItem struct {
	Id          int    `json:"id"`
	Description string `json:"task"`
}

type User struct {
	Username string `json:"username"`
}

func addTask(w http.ResponseWriter, r *http.Request) {
	var task Task

	err := json.NewDecoder(r.Body).Decode(&task)
	if err != nil {
		log.Printf("JSON decode error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	_, err = postgres.Exec("INSERT INTO todoTasks(username, description) VALUES ($1, $2);", task.Username, task.Description)
	if err != nil {
		log.Printf("Task insertion error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var id int
	row := postgres.QueryRow("SELECT id FROM todoTasks WHERE username = $1 ORDER BY id DESC LIMIT 1;", task.Username)
	err = row.Scan(&id)
	if err != nil {
		log.Printf("Id retrieval error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	returnId, err := json.Marshal(id)
	if err != nil {
		log.Printf("JSON marshal error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(returnId)
	return
}

func retrieveTasks(w http.ResponseWriter, r *http.Request) {
	var user User

	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		log.Printf("JSON decode error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	rows, err := postgres.Query("SELECT id, description FROM todoTasks WHERE username = $1 ORDER BY id;", user.Username)
	if err != nil {
		log.Printf("Task retrieval error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var items []ListItem

	for rows.Next() {
		var item ListItem
		err = rows.Scan(&item.Id, &item.Description)
		if err != nil {
			log.Printf("Task retrieval error: %f", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		items = append(items, item)
	}

	err = rows.Err()
	if err != nil {
		log.Printf("Task retrieval error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	returnTasks, err := json.Marshal(items)
	if err != nil {
		log.Printf("JSON marshal error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(returnTasks)
	return
}

func deleteTask(w http.ResponseWriter, r *http.Request) {
	var item ListItem

	err := json.NewDecoder(r.Body).Decode(&item)
	if err != nil {
		log.Printf("JSON decode error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	_, err = postgres.Exec("DELETE FROM todoTasks WHERE id = $1 AND description = $2;", item.Id, item.Description)
	if err != nil {
		log.Printf("Task deletion error: %f", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	return
}
