const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

let accessToken = localStorage.getItem("accessToken") || "";

export const setAccessToken = (token) => {
  accessToken = token || "";

  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

const request = async (path, options = {}, retry = true) => {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  if (response.status === 401 && retry && path !== "/auth/refresh") {
    const refreshed = await refreshSession();

    if (refreshed) {
      return request(path, options, false);
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export const refreshSession = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include"
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setAccessToken("");
      return null;
    }

    setAccessToken(data.accessToken);
    return data;
  } catch (_error) {
    setAccessToken("");
    return null;
  }
};

export const api = {
  signup: (payload) =>
    request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  logout: () =>
    request("/auth/logout", {
      method: "POST"
    }),
  me: () => request("/users/me"),
  updateProfile: (payload) =>
    request("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload)
    })
};
