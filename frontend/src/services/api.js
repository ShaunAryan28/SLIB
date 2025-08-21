import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.REACT_APP_API_URL}/api`,  // 👈 note the /api
});

export default API;
