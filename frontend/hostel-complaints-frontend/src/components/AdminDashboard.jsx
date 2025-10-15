import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


function AdminDashboard() {
  const navigate = useNavigate();
  // ---------- Logout Function /button ----------
  const handleLogout = () => {
    localStorage.removeItem("admin"); //  remove stored admin info
    toast.info("Logged out successfully!");
    navigate("/admin-login"); // redirect to login page
  };

  // Optional: redirect if not logged in
  useEffect(() => {
    const admin = localStorage.getItem("admin");
    if (!admin) navigate("/admin-login");
  }, []);
  //  
  // ---------- State ----------
  const [complaints, setComplaints] = useState([]); // all complaints
  const [filter, setFilter] = useState("ALL"); // filter status
  const [loading, setLoading] = useState(false); // loading indicator

  // ---------- Fetch complaints (with smart update) ----------
  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/admin/complaints");
      // Only update state if data changed
      setComplaints(prev => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(res.data);
        return prevStr !== newStr ? res.data : prev;
      });
    } catch (err) {
      toast.error("Failed to fetch complaints!");
    }
  };

  // ---------- Update complaint status ----------
  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/complaints/${id}?status=${status}`);
      toast.success(`Complaint marked as ${status}`);
      fetchComplaints(); // refresh after update
    } catch (err) {
      toast.error("Failed to update status!");
    }
  };

  // ---------- Polling effect ----------
  useEffect(() => {
    fetchComplaints(); // initial fetch
    const interval = setInterval(fetchComplaints, 5000); // every 5 seconds
    return () => clearInterval(interval); // cleanup
  }, []);

  // ---------- Badge style ----------
  const getBadgeStyle = (status) => {
    switch (status) {
      case "PENDING":
        return { color: "white", background: "red", padding: "5px 10px", borderRadius: "6px", fontWeight: "bold" };
      case "IN_PROGRESS":
        return { color: "black", background: "yellow", padding: "5px 10px", borderRadius: "6px", fontWeight: "bold" };
      case "RESOLVED":
        return { color: "white", background: "green", padding: "5px 10px", borderRadius: "6px", fontWeight: "bold" };
      default:
        return {};
    }
  };

  // ---------- Filter complaints ----------
  const filteredComplaints = complaints.filter(c => filter === "ALL" || c.status === filter);

  // ---------- Render ----------
  return (


    //  Main container ----------
    <div style={{ maxWidth: "1485px", margin: "20px auto", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#030304ff"}}>Admin Dashboard</h1>
              
           {/* Logout Button */}
      <div style={{ textAlign: "right", marginBottom: "20px" ,marginRight: "200px"}}>
        <button onClick={handleLogout} style={{ padding: "10px 15px",fontWeight: "bolder", borderRadius: "26px", background: "#ed0909ff", color: "white", border: "none", cursor: "pointer" }}>
          Logout
        </button>
      </div>

      {/* ---------- Filter Buttons ---------- */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        
        {["ALL", "PENDING", "IN_PROGRESS", "RESOLVED"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              margin: "0 5px",
              padding: "6px 18px",
              borderRadius: "6px",
              cursor: "pointer",
              background: filter === f ? "#3498db" : "#c5d8ddff",
              color: filter === f ? "white" : "black",
              border: "none",
            }}
          >
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* ---------- Complaints List ---------- */}
      {loading ? (
        // Loading Indicator
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        // Complaints List
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px"  }}>
          {filteredComplaints.length > 0 ? (
            filteredComplaints.map(c => (
              <div
                key={c.id}
                style={{
                  width: "250px",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "15px",
                  boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                  textAlign: "left",
                  transition: "transform 0.2s",
                  background: "#fff",
                }}
                // Hover effect
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
              >
                {/* ---------- Complaint Details ---------- */}
                {/* <p><b>ID:</b> {c.id}</p> */}
                <p><b>Complaint:</b> {c.description}</p>
                <p><b>Status:</b> <span style={getBadgeStyle(c.status)}>{c.status}</span></p>

                {/* ---------- Action Buttons ---------- */}
                <div style={{ marginTop: "10px" }}>
                  {c.status !== "RESOLVED" && (
                    <>
                      <button
                        onClick={() => updateStatus(c.id, "IN_PROGRESS")}
                        style={{ marginRight: "10px", padding: "5px 10px", borderRadius: "6px", cursor: "pointer", background: "#f1c40f", border: "none", color: "black" }}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => updateStatus(c.id, "RESOLVED")}
                        style={{ padding: "5px 10px", borderRadius: "6px", cursor: "pointer", background: "#2ecc71", border: "none", color: "white" }}
                      >
                        Resolve
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: "center" }}>No complaints found</p>
          )}
        </div>
      )}

      {/* ---------- Toast Container ---------- */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default AdminDashboard;
