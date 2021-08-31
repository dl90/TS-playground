
// Regex must be string to be compatible with JSON schema
export const emailRgx = '^[^\s@]+@[^\s@]+\.[^\s@]+$'
export const passwordRgx = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
