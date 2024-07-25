package utils

func ValidateISBN(isbn string) bool {
	if len(isbn) != 13 {
		return false
	}
	for _, c := range isbn {
		if c < '0' || c > '9' {
			return false
		}
	}
	return true
}
