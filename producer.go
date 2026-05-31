package main

import (
	"encoding/csv"
	"os"
)

func loadRecipients(filepath string, ch chan Recipient) error {
	// Implement the logic to read the CSV file and parse the recipients
	// Return a slice of Recepient and an error if any

	defer close(ch) // Close the channel when done

	file, err := os.Open(filepath)
	if err != nil {
		return err
	}
	defer file.Close()

	// Implement CSV parsing logic here
	csvReader := csv.NewReader(file)
	records, err := csvReader.ReadAll()
	if err != nil {
		return err
	}

	// var recipients []Recepient
	for _, record := range records[1:] { // Skip header row
		if len(record) < 2 {
			continue // Skip invalid records
		}

		// fmt.Printf("Loaded recipient: Record=%v\n", record)

		ch <- Recipient{
			Name:  record[0],
			Email: record[1],
		}
		// recipients = append(recipients, Recepient{
		// 	Name:  record[0],
		// 	Email: record[1],
		// })
	}

	return nil
}
