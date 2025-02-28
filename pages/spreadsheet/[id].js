"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { DataGrid } from "react-data-grid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-data-grid/lib/styles.css";

// Google Sheets API Setup
const API_URL = "https://sheets.googleapis.com/v4/spreadsheets";
const SPREADSHEET_ID = "your-google-sheet-id"; // Replace with your actual Google Spreadsheet ID
const API_KEY = "your-api-key"; // Replace with your Google API key

const Spreadsheet = () => {
    const router = useRouter();
    const { id: spreadsheetId } = router.query;

    const [spreadsheet, setSpreadsheet] = useState(null);
    const [rows, setRows] = useState([]);
    const [colsCount, setColsCount] = useState(5);
    const [rowsCount, setRowsCount] = useState(10);

    useEffect(() => {
        if (spreadsheetId) {
            fetchSpreadsheetData();
        }
    }, [spreadsheetId]);

    const fetchSpreadsheetData = async () => {
        try {
            const response = await axios.get(`${API_URL}/${spreadsheetId}/values/A1:Z1000?key=${API_KEY}`);
            const data = response.data;
            setSpreadsheet(data);

            const rangeData = data.values || [];
            const newRows = formatCells(rangeData);
            setRows(newRows);

            setRowsCount(newRows.length);
            setColsCount(newRows[0]?.length || 5);
        } catch (error) {
            console.error("Error fetching spreadsheet:", error);
            toast.error("Failed to load spreadsheet.");
        }
    };

    const formatCells = (cells) => {
        return cells.map((row, rowIdx) => {
            const rowData = { id: rowIdx };
            row.forEach((value, colIdx) => {
                const colName = convertNumberToColumnName(colIdx);
                rowData[`${colName}${rowIdx + 1}`] = value;
            });
            return rowData;
        });
    };

    const handleCellChange = async (rowId, columnKey, newValue) => {
        const columnLetter = columnKey.match(/[A-Z]+/)[0];
        const columnIndex = columnLetter.charCodeAt(0) - 65;
        const rowIndex = rowId;

        setRows((prevRows) =>
            prevRows.map((row) => (row.id === rowId ? { ...row, [columnKey]: newValue } : row))
        );

        try {
            const range = `${columnLetter}${rowIndex + 1}`;
            await axios.put(
                `${API_URL}/${SPREADSHEET_ID}/values/${range}?valueInputOption=RAW&key=${API_KEY}`,
                {
                    range,
                    values: [[newValue]],
                }
            );

            toast.success("Cell updated successfully!");
        } catch (error) {
            console.error("Error updating cell:", error);
            toast.error("Failed to update cell!");
        }
    };

    const handleUpdateGrid = async () => {
        try {
            const newRange = `A1:${convertNumberToColumnName(colsCount - 1)}${rowsCount}`;
            await axios.put(
                `${API_URL}/${SPREADSHEET_ID}/values/${newRange}?valueInputOption=RAW&key=${API_KEY}`,
                {
                    range: newRange,
                    values: generateEmptyCells(rowsCount, colsCount),
                }
            );

            toast.success("Grid updated successfully!");
        } catch (error) {
            console.error("Error updating grid:", error);
            toast.error("Failed to update grid!");
        }
    };

    const generateEmptyCells = (rows, cols) => {
        return Array.from({ length: rows }, (_, rowIdx) => {
            let row = { id: rowIdx };
            for (let colIdx = 0; colIdx < cols; colIdx++) {
                const colName = convertNumberToColumnName(colIdx);
                row[`${colName}${rowIdx + 1}`] = "";
            }
            return row;
        });
    };

    const convertNumberToColumnName = (colIdx) => {
        let columnName = '';
        let dividend = colIdx + 1;
        while (dividend > 0) {
            let modulo = (dividend - 1) % 26;
            columnName = String.fromCharCode(modulo + 65) + columnName;
            dividend = Math.floor((dividend - modulo) / 26);
        }
        return columnName;
    };

    const columns = Array.from({ length: colsCount }, (_, colIdx) => ({
        key: `${convertNumberToColumnName(colIdx)}1`,
        name: `${convertNumberToColumnName(colIdx)}1`,
        editable: true,
    }));

    // Add Row
    const handleAddRow = () => {
        setRows((prevRows) => {
            const newRow = { id: prevRows.length };
            for (let colIdx = 0; colIdx < colsCount; colIdx++) {
                const colName = convertNumberToColumnName(colIdx);
                newRow[`${colName}${prevRows.length + 1}`] = "";
            }
            return [...prevRows, newRow];
        });

        setRowsCount(rowsCount + 1);
    };

    // Add Column
    const handleAddColumn = () => {
        setColsCount(colsCount + 1);
        setRows((prevRows) => {
            return prevRows.map((row) => {
                const newColName = convertNumberToColumnName(colsCount - 1);
                row[`${newColName}${row.id + 1}`] = "";
                return row;
            });
        });
    };

    return (
        <div className="p-4 bg-white min-h-screen border-2 border-black w-full max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center mb-2 p-2 border-b border-black">
                <h2 className="text-lg font-bold">{spreadsheet ? spreadsheet.properties.title : "Loading..."}</h2>
                <span className="text-sm">Rows: {rowsCount} | Columns: {colsCount}</span>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <label className="font-semibold">Rows:</label>
                <input
                    type="number"
                    value={rowsCount}
                    onChange={(e) => setRowsCount(Number(e.target.value))}
                    className="border px-2 py-1 rounded w-20"
                />
                <label className="font-semibold">Columns:</label>
                <input
                    type="number"
                    value={colsCount}
                    onChange={(e) => setColsCount(Number(e.target.value))}
                    className="border px-2 py-1 rounded w-20"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleUpdateGrid}>
                    Update Grid
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleAddRow}>
                    Add Row
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={handleAddColumn}>
                    Add Column
                </button>
            </div>

            <DataGrid
                columns={columns}
                rows={rows}
                onRowsChange={setRows}
                onCellEditCommit={(params) => handleCellChange(params.row.id, params.columnKey, params.value)}
            />

            <ToastContainer />
        </div>
    );
};

export default Spreadsheet;
