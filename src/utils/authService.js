const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://23.108.100.247:8004';

async function parseResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data?.detail;
    if (typeof detail === 'string') throw new Error(detail);
    if (Array.isArray(detail)) {
      throw new Error(detail.map((item) => {
        const field = Array.isArray(item?.loc) ? item.loc[item.loc.length - 1] : null;
        return field ? `${field}: ${item?.msg || 'Invalid value'}` : item?.msg || item;
      }).join(', '));
    }
    throw new Error(data?.message || `Request failed with HTTP ${response.status}`);
  }

  return data;
}

export async function signupUser({ email, fullname, username, password, confirmPassword }) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      fullname,
      username,
      password,
      confirm_password: confirmPassword,
    }),
  });

  return parseResponse(response);
}

export async function loginUser({ username, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  return parseResponse(response);
}

export async function logoutUser(accessToken) {
  if (!accessToken) return { detail: 'No active session' };

  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseResponse(response);
}
