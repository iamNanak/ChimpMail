package main

import (
	"bytes"
	"sync"
	"text/template"
)

type Recipient struct {
	Name  string
	Email string
}

func main() {
	recipientsChan := make(chan Recipient)
	var wg sync.WaitGroup

	totalWorkers := 5 // You can adjust this based on your requirements

	for i := 1; i <= totalWorkers; i++ {
		wg.Add(1)
		go worker(i, recipientsChan, &wg)
	}
	go loadRecipients("./name_email.csv", recipientsChan)

	// Wait for the worker to finish processing (you can use sync.WaitGroup or other synchronization methods)
	// For simplicity, we will just block the main goroutine here

	wg.Wait()

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
