function readApiUrl(): string {
  const value = import.meta.env.VITE_API_URL;

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  throw new Error(
    "VITE_API_URL is not set. Add it to your local .env file (see .env.example)."
  );
}

export const env = {
  apiUrl: readApiUrl(),
} as const;
