import axios from "axios";

const API_URL = "http://127.0.0.1:8000"; // Django Backend URL

export const api = axios.create({
    baseURL: API_URL + "/api/v1",
    headers: { "Content-Type": "application/json" },
});

// Spreadsheets API
export const createSpreadsheet = (data) => api.post("/spreadsheets/", data);

export const getSpreadsheets = () => api.get("/spreadsheets/");
export const getSpreadsheet = (id) => api.get(`/spreadsheets/${id}/`);
export const addSpreadsheet = (data) => api.post("/spreadsheets/", data);
export const updateSpreadsheet = (id, data) => api.put(`/spreadsheets/${id}/`, data);
export const deleteSpreadsheet = (id) => api.delete(`/spreadsheets/${id}/`);

export const getSpreadsheetDetails = (id) => api.get(`/spreadsheets/${id}/`);


// Cells API
export const getCells = () => api.get("/cells/");
export const getSpreadsheetCells = (spreadsheetId) => api.get(`/spreadsheets/${spreadsheetId}/cells/`);
export const addCell = (data) => api.post("/cells/", data);
export const updateCell = (id, data) => api.put(`/cells/${id}/`, data);
export const deleteCell = (id) => api.delete(`/cells/${id}/`);
export const evaluateCell = (id) => api.post(`/cells/${id}/evaluate/`);
export const cleanData = (spreadsheetId) => api.post(`/cells/clean/`, { spreadsheet_id: spreadsheetId });
