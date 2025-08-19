import React, { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_URL_BASE || "http://localhost:3000";
const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;
const validStatus = [
  { "label": "All", "value": "" },
  { "label": "Pending", "value": "pending" },
  { "label": "Delivered", "value": "delivered" },
  { "label": "Failed", "value": "failed" },
  { "label": "Dead", "value": "dead" }
]
const NotesTable = ({ refreshSignal }) => {
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] =  useState("");

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/notes?status=${filterStatus}&page=${page}`, {
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [page, refreshSignal, filterStatus]);

  const replayNote = async (noteId) => {
    try {
      const res = await fetch(`${API_BASE}/api/notes/${noteId}/replay`, {
        method: "POST",
        headers: { Authorization: `Bearer ${ADMIN_TOKEN}` },
      });
      if (!res.ok) throw new Error("Replay failed");

      // Refresh notes after replay
      await fetchNotes();
    } catch (error) {
      alert("Failed to replay note: " + error.message);
    }
  };

  return (
    <>
      {loading && <p>Loading notes...</p>}
      {!loading && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #ccc" }}>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Last Attempt Code</th>
              <th>Release At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
              {notes.map(note => {

                // Get last attempt statusCode or "-"
                const lastAttempt = note.attempts.length > 0
                  ? note.attempts[note.attempts.length - 1]
                  : null;

                return (
                  <tr
                    key={note._id}
                  >
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee", textAlign : "center" }}>{note._id}</td>
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee", textAlign : "center" }}>{note.title}</td>
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee", textAlign : "center" }}>{note.status}</td>
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee", textAlign : "center" }}>
                      {lastAttempt ? lastAttempt.statusCode : "-"}
                    </td>
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee", textAlign : "center" }}>{new Date(note.releaseAt).toLocaleString("en-IN")}</td>
                    <td style={{ padding: "0.5rem", borderBottom: "1px solid #eee", textAlign : "center" }}>
                      {(note.status === "failed" || note.status === "dead") ? (
                        <button onClick={() => replayNote(note._id)}>Replay</button>
                      ): "None"}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      <div style={{ marginTop: "1rem" }}>
      <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)}>
        {validStatus.map(status => (<option value = {status.value} key = {status.value}>{status.label}</option>))}
      </select>
      <div style={{ marginTop: "1rem" }}>
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page <= 1}>
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
      </div>
    </div>
    </>
  );
};

export default NotesTable;
