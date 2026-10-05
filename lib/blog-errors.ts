import axios from "axios";

export function blogSaveError(error: unknown): string {
  if (!axios.isAxiosError(error)) return "Unable to save the blog. Please try again.";

  const status = error.response?.status;
  if (!error.response) {
    return "Cannot reach the blog server. Check your connection and try again. If this continues, ask support to check the API connection and CORS configuration.";
  }
  if (status === 401) return "Your session has expired. Please sign in again before saving.";
  if (status === 403) return "Your account does not have permission to save blogs.";
  if (status === 413) return "The blog or cover image is too large. Reduce its size and try again.";
  if (status && status >= 500) {
    return `The server could not save the blog (HTTP ${status}). Please try again or contact support.`;
  }

  const message: unknown = error.response.data?.message;
  if (Array.isArray(message)) {
    const messages = message.filter((item): item is string => typeof item === "string");
    if (messages.length) return messages.join("\n");
  }
  if (typeof message === "string" && message.trim()) return message;
  return `Unable to save the blog (HTTP ${status}). Please try again.`;
}
