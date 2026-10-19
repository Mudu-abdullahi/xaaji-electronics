const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "https://xaaji-electronics-api.onrender.com"
).replace(/\/$/, "");

export default API_BASE_URL;
