package datatypes

type EmailType struct {
	Link      string   `json:"link"`
	To        []string `json:"to"`
	Community string   `json:"community"`
	Type      string   `json:"type"`
}
