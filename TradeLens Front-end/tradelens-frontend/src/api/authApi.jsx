import axios from "axios";
const BASE_URL = "http://localhost:8080/auth";

export const signup = (data) => axios.post(`${BASE_URL}/signup`, data);
export const login = (data) => axios.post(`${BASE_URL}/login`, data);
export const checkHealth = () => axios.get(`${BASE_URL}/health`);
