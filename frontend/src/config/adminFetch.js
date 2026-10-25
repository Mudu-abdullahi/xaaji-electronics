import API_BASE_URL from "./api";

export default function adminFetch(url, options = {}) {
  const token = sessionStorage.getItem("adminToken");

  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(url, {
    ...options,
    headers,
  });
}

export { API_BASE_URL };
