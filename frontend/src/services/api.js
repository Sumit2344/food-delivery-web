const API_BASE = '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload?.message || 'Request failed';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

export function registerUser({ name, email, password }) {
  return request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
}

export function loginUser(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

export function getCurrentUser(token) {
  return request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
}

function authenticatedRequest(path, options = {}) {
  return request(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('tomato_token') || ''}`,
      ...(options.headers || {})
    }
  });
}

export function getProfileData() {
  return authenticatedRequest('/profile');
}

export function saveNotificationSettings(settings) {
  return authenticatedRequest('/profile/settings', {
    method: 'PATCH',
    body: JSON.stringify({ settings })
  });
}

export function addProfileBookmark(item) {
  return authenticatedRequest('/profile/bookmarks', {
    method: 'POST',
    body: JSON.stringify({ item })
  });
}

export function removeProfileBookmark(id) {
  return authenticatedRequest(`/profile/bookmarks/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

export function submitRestaurantReview({ restaurantId, rating, text }) {
  return authenticatedRequest('/profile/reviews', {
    method: 'POST',
    body: JSON.stringify({ restaurantId, rating, text })
  });
}

export function getProfileUsers(query, followingOnly = false) {
  const params = new URLSearchParams();
  if (query) params.set('q', query);
  if (followingOnly) params.set('following', 'true');
  const queryString = params.toString();
  return authenticatedRequest(`/profile/users${queryString ? `?${queryString}` : ''}`);
}

export function followProfileUser(userId, following) {
  return authenticatedRequest(`/profile/users/${encodeURIComponent(userId)}/follow`, {
    method: following ? 'DELETE' : 'POST'
  });
}

export function markProfileNotificationRead(notificationId) {
  return authenticatedRequest(`/profile/notifications/${encodeURIComponent(notificationId)}`, { method: 'PATCH' });
}

export function getRestaurants(city = '', slug = '', query = '') {
  const params = new URLSearchParams();
  if (city) params.set('city', city);
  if (slug) params.set('slug', slug);
  if (query) params.set('q', query);

  const url = params.toString();
  return request(`/restaurants${url ? `?${url}` : ''}`);
}

export function getNearbyRestaurants(lat, lng, radiusKm = 5) {
  const params = new URLSearchParams({ lat: String(lat), lng: String(lng), radiusKm: String(radiusKm) });
  return request(`/restaurants/nearby?${params.toString()}`);
}

export function getPaymentConfig() {
  return request('/payment/config');
}

export function placeOrder({ userId, restaurantId, items, deliveryAddress = 'Home', paymentMethod = 'cod' }) {
  return request('/orders', {
    method: 'POST',
    headers: { Authorization: `Bearer ${localStorage.getItem('tomato_token') || ''}` },
    body: JSON.stringify({ userId, restaurantId, items, deliveryAddress, paymentMethod })
  });
}

export function submitPaymentReference(orderId, reference) {
  return request(`/orders/${encodeURIComponent(orderId)}/payment-reference`, {
    method: 'POST',
    body: JSON.stringify({ reference })
  });
}

export function getOrders(userId) {
  const params = new URLSearchParams();
  if (userId) params.set('userId', userId);
  return request(`/orders${params.toString() ? `?${params.toString()}` : ''}`);
}
