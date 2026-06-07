package main

import (
	"fmt"
	"net/smtp"
	"sync"
	"time"
)

func worker(id int, ch chan Recipient, wg *sync.WaitGroup) {
	if wg != nil {
		defer wg.Done()
	}

	for recipient := range ch {
		smtpHost := "localhost"
		smtpPort := "1025"

		// formattedMsg := fmt.Sprintf(
		// 	"To: %s\r\nSubject: Test Email!\r\n\r\nHello %s,\n\nThis is a test email.",
		// 	recipient.Email,
		// 	recipient.Name,
		// )
		// msg := []byte(formattedMsg)

		body, err := executeTemplate(recipient)
		if err != nil {
			fmt.Printf("Worker %d: Failed to execute template for %s <%s>: %v\n", id, recipient.Name, recipient.Email, err)
			continue
		}

		msg := fmt.Sprintf(
			"From: %s\r\n"+
				"To: %s\r\n"+
				"Subject: Test Email\r\n"+
				"MIME-Version: 1.0\r\n"+
				"Content-Type: text/html; charset=UTF-8\r\n\r\n%s",
			"iamnanak01@gmail.com",
			recipient.Email,
			body,
		)

		err = smtp.SendMail(smtpHost+":"+smtpPort, nil, "iamnanak01@gmail.com", []string{recipient.Email}, []byte(msg))
		if err != nil {
			fmt.Printf("Worker %d: Failed to send email to %s <%s>: %v\n", id, recipient.Name, recipient.Email, err)
		} else {
			time.Sleep(1 * time.Second)
			fmt.Printf("Worker %d: Email sent successfully to %s <%s>\n", id, recipient.Name, recipient.Email)
		}

	}
}
