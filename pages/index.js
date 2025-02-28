import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { getSpreadsheets, deleteSpreadsheet, updateSpreadsheet, createSpreadsheet } from "../utils/api";
import { Box, Container } from "@mui/material";

export default function DataTable() {
  const [spreadsheets, setSpreadsheets] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editName, setEditName] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10, // Maximum 10 per page
  });

  const router = useRouter();

  useEffect(() => {
    fetchSpreadsheets();
  }, []);

  const fetchSpreadsheets = async () => {
    try {
      const { data } = await getSpreadsheets();
      const formattedData = data.map((item, index) => ({
        id: item.id,
        si_no: index + 1, // Serial Number starts from 1
        name: item.name,
        created_at: item.created_at
          ? new Date(item.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
          : "N/A",
        link: item.link ? item.link.link : "N/A"
      }));
      setSpreadsheets(formattedData);
      console.log("Fetched Data:", formattedData);
    } catch (error) {
      console.error("Error fetching spreadsheets:", error);
    }
  };

  const handleCreate = async () => {
    try {
      const newSpreadsheet = { name: "New Spreadsheet" };
      const { data } = await createSpreadsheet(newSpreadsheet);
      setSpreadsheets((prev) => [
        ...prev,
        {
          ...data,
          si_no: prev.length + 1, // Ensure SI No. updates correctly
          created_at: new Date(data.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.error("Error creating spreadsheet:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSpreadsheet(id);
      setSpreadsheets((prev) =>
        prev.filter((item) => item.id !== id).map((item, index) => ({
          ...item,
          si_no: index + 1, // Recalculate SI No. after delete
        }))
      );
    } catch (error) {
      console.error("Error deleting spreadsheet:", error);
    }
  };

  const handleEdit = (id, name) => {
    setEditMode(id);
    setEditName(name);
  };

  const handleUpdate = async (id) => {
    try {
      await updateSpreadsheet(id, { name: editName });
      setSpreadsheets((prev) =>
        prev.map((item) => (item.id === id ? { ...item, name: editName } : item))
      );
      setEditMode(null);
    } catch (error) {
      console.error("Error updating spreadsheet:", error);
    }
  };

  const handleView = (id) => {
    const spreadsheet = spreadsheets.find((spreadsheet) => spreadsheet.id === id);
    if (spreadsheet && spreadsheet.link) {
      window.open(spreadsheet.link, "_blank"); // Opens the link in a new tab
    } else {
      console.error("Link not found for the spreadsheet");
    }
  };

  const columns = [
    { field: "si_no", headerName: "SI No.", width: 90 }, // Added SI No. column
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "name",
      headerName: "Spreadsheet Name",
      width: 250,
      renderCell: (params) =>
        editMode === params.row.id ? (
          <TextField
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            size="small"
            autoFocus
          />
        ) : (
          <span>{params.value}</span>
        ),
    },
    {
      field: "created_at",
      headerName: "Created Time",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 250,
      renderCell: (params) => (
        <Box display="flex" gap={1} className="mt-2">
          {editMode === params.row.id ? (
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleUpdate(params.row.id)}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleEdit(params.row.id, params.row.name)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleView(params.row.id)}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="md">
      <Paper sx={{ height: 710, width: "110%", padding: 2, marginTop: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button variant="contained" color="primary" onClick={handleCreate}>
            Create New Spreadsheet
          </Button>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <DataGrid
            rows={spreadsheets}
            columns={columns}
            pageSizeOptions={[5, 10]}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            checkboxSelection
            sx={{ minWidth: 600 }}
          />
        </Box>
      </Paper>
    </Container>
  );
}
