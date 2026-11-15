// API configuration — the NestJS server on Render.
// Override per environment with VITE_API_URL.
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://myshop-server-0mz8.onrender.com";

// API endpoints
export const API_ENDPOINTS = {
  items: `${API_BASE_URL}/api/items`,
  itemsFull: `${API_BASE_URL}/api/items/full`,
  itemById: (id: string) => `${API_BASE_URL}/api/items/${id}`,
} as const;
