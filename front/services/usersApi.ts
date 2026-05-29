import { fetchAuthSession } from 'aws-amplify/auth';

const USERS_API_BASE = 'https://2vbl0rpwxd.execute-api.us-east-1.amazonaws.com/dev';

// Types
export interface CartItem {
  productId: string;
  qty: number;
  price: number;
}

export interface RecentlyViewedItem {
  productId: string;
  viewedAt: string;
}

// Get auth token and userId from Cognito session
async function getAuthInfo() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  const userId = session.tokens?.idToken?.payload?.sub as string;

  if (!token || !userId) {
    throw new Error('User not authenticated');
  }

  return { token, userId };
}

// Generic fetch helper with auth
async function authFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const { token } = await getAuthInfo();

  const response = await fetch(`${USERS_API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== CART ====================

export async function getCart(): Promise<{ cart: CartItem[] }> {
  const { userId } = await getAuthInfo();
  return authFetch(`/users/${userId}/cart`);
}

export async function addToCart(
  productId: string,
  qty: number,
  price: number
): Promise<{ cart: CartItem[] }> {
  const { userId } = await getAuthInfo();
  return authFetch(`/users/${userId}/cart`, {
    method: 'POST',
    body: JSON.stringify({ productId, qty, price }),
  });
}

export async function removeFromCart(productId: string): Promise<{ cart: CartItem[] }> {
  const { userId } = await getAuthInfo();
  return authFetch(`/users/${userId}/cart/${productId}`, {
    method: 'DELETE',
  });
}

// ==================== FAVORITES ====================

export async function getFavorites(): Promise<{ favorites: string[] }> {
  const { userId } = await getAuthInfo();
  return authFetch(`/users/${userId}/favorites`);
}

export async function addToFavorite(productId: string): Promise<{ favorites: string[] }> {
  const { userId } = await getAuthInfo();
  return authFetch(`/users/${userId}/favorites`, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}

export async function removeFavorite(productId: string): Promise<{ favorites: string[] }> {
  const { userId } = await getAuthInfo();
  return authFetch(`/users/${userId}/favorites/${productId}`, {
    method: 'DELETE',
  });
}

// ==================== RECENTLY VIEWED ====================

export async function getRecentlyViewed(): Promise<{ recentlyViewed: RecentlyViewedItem[] }> {
  const { userId } = await getAuthInfo();
  return authFetch(`/users/${userId}/recently-viewed`);
}

export async function addToRecentlyViewed(
  productId: string
): Promise<{ recentlyViewed: RecentlyViewedItem[] }> {
  const { userId } = await getAuthInfo();
  return authFetch(`/users/${userId}/recently-viewed`, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });
}
