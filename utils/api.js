import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Django Backend URL

export const api = axios.create({
    baseURL: API_URL + "/api/v1",
    headers: { "Content-Type": "application/json" },
});

// Spreadsheets API
export const createSpreadsheet = (data) => api.post("/spreadsheets/", data);

export const getSpreadsheets = () => api.get("/spreadsheets-with-link/");
export const getSpreadsheet = (id) => api.get(`/spreadsheets/${id}/`);
export const addSpreadsheet = (data) => api.post("/spreadsheets/", data);
export const updateSpreadsheet = (id, data) => api.put(`/spreadsheets/${id}/`, data);
export const deleteSpreadsheet = (id) => api.delete(`/spreadsheets/${id}/`);
