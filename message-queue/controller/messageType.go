package controller

type MessageType struct {
	Message string `json:"message"`
	To      string `json:"to"`
	From    string `json:"from"`
}
