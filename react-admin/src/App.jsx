import { useState } from 'react'
import './App.css'
import React from "react";
import NoteForm from "./components/NoteForm.jsx";
import NotesTable from "./components/NotesTable.jsx";

function App() {
  const [refreshSignal, setRefreshSignal] = useState(0);
  const createNote = async (noteData) => {
    try {
      const res = await fetch(import.meta.env.VITE_API_URL_BASE + "/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_ADMIN_TOKEN}`,
        },
        body: JSON.stringify(noteData),
      });

      if (!res.ok) {
        let errorMessage = "Failed to create note";
         const errorData = await res.json();
          if (errorData?.error) {
            errorMessage = errorData.error;
        }
        throw new Error(errorMessage);
      }
      alert(`Note Added Successfully.`);
      setRefreshSignal(s => s + 1);
      return await res.json();
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error("Error creating note:", error);
      return null;
    }
  };

  return (
    <>
      <div>
        <h1>Create New Note</h1>
        <NoteForm onCreate={createNote} />
        <div style={{ marginTop: "2rem" }} >
          <NotesTable refreshSignal={refreshSignal} />
        </div>
      </div>
    </>
  )
}

export default App
