export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function safeKey(input: string) {
  return input.replace(/[^a-zA-Z0-9:_-]/g, "_");
}

export function nowISO() {
  return new Date().toISOString();
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
