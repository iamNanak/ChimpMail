package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

// Matches the payloads Next.js proxy will send
type SendRequest struct {
	TemplateID string      `json:"templateId"`
	Subject    string      `json:"subject"`
	Recipients []Recipient `json:"recipients"`
}

type SendResponse struct {
	JobID    string    `json:"jobId"`
	Sent     int       `json:"sent"`
	Failed   int       `json:"failed"`
	Failures []Failure `json:"failures"`
}

type Failure struct {
	Email  string `json:"email"`
	Reason string `json:"reason"`
}

type TemplateContext struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// SetupRoutes registers our API endpoints.
func SetupRoutes(recipientsChan chan<- Recipient) *http.ServeMux {
	mux := http.NewServeMux()

	// Handle frontend GET /api/templates
	mux.HandleFunc("/api/templates", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		templates := []TemplateContext{
			{ID: "email.tmpl", Name: "Default Email Template"},
		}

		json.NewEncoder(w).Encode(templates)
	})

	// Handle frontend POST /api/send
	mux.HandleFunc("/api/send", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var req SendRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, `{"error": "Invalid JSON"}`, http.StatusBadRequest)
			return
		}

		// Validation identical to Next.js route validation
		if req.TemplateID == "" {
			http.Error(w, `{"error": "Unknown templateId"}`, http.StatusBadRequest)
			return
		}
		if req.Subject == "" {
			http.Error(w, `{"error": "Subject is required"}`, http.StatusBadRequest)
			return
		}
		if len(req.Recipients) == 0 {
			http.Error(w, `{"error": "At least one recipient is required"}`, http.StatusBadRequest)
			return
		}

		// Send recipients into the channel for the background workers
		sentCount := 0
		var failures []Failure

		for _, recipient := range req.Recipients {
			// In Go channels, we push them asynchronously.
			// If channel isn't blocking, this loops quickly.
			recipientsChan <- recipient
			sentCount++
		}

		jobId := fmt.Sprintf("job_%d", time.Now().UnixMilli())
		resp := SendResponse{
			JobID:    jobId,
			Sent:     sentCount,
			Failed:   len(failures),
			Failures: failures,
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resp)
	})

	return mux
}
