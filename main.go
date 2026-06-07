package main

import (
	"bytes"
	"fmt"
	"net/http"
	"text/template"
)

type Recipient struct {
	Name  string
	Email string
}

func main() {
	recipientsChan := make(chan Recipient)

	totalWorkers := 5

	// 1. Boot up the consumer workers
	// (We no longer track wg.Add/Wait inside main, as workers run infinitely)
	for i := 1; i <= totalWorkers; i++ {
		// you'll need to modify worker() signature to not take wg, or just pass a dummy one
		go worker(i, recipientsChan, nil)
	}

	// Optional: keep the CSV loader if you still want CLI processing too
	// go loadRecipients("./name_email.csv", recipientsChan)

	// 2. Setup the HTTP handlers
	mux := SetupRoutes(recipientsChan)

	// 3. Start the Web Server
	fmt.Println("Server is running on http://localhost:8081")
	if err := http.ListenAndServe(":8081", mux); err != nil {
		fmt.Printf("Server failed: %v\n", err)
	}
}

func executeTemplate(recipient Recipient) (string, error) {
	tmpl, err := template.ParseFiles("./email.tmpl")
	if err != nil {
		return "", err
	}
	var buf bytes.Buffer
	err = tmpl.Execute(&buf, recipient)
	if err != nil {
		return "", err
	}
	return buf.String(), nil
}
