import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// helper untuk set token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("kompor_token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("kompor_token");
  }
};

// pas reload, cek kalau ada token di localStorage
const savedToken = localStorage.getItem("kompor_token");
if (savedToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

export default api;
