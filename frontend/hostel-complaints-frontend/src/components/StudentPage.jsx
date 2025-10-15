import { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



// ------------ StudentPage Component ------------
function StudentPage() {
  // ------------ Registration/Login State ------------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [studentId, setStudentId] = useState("");

  // ------------ Complaint State ------------
  const [complaintText, setComplaintText] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  // Automatically load logged-in student if already saved
useEffect(() => {
  const id = localStorage.getItem("studentId");
  if (id) setStudentId(id);
}, []);

  // ------------ Register Student ------------
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return toast.error("All fields are required!");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return toast.error("Enter a valid email address!");
    }

    const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (!strongPassword.test(password)) {
      return toast.error(
        "Password must be at least 6 characters, include uppercase, lowercase, number & special character!"
      );
    }

    try {
      await axios.post("http://localhost:8080/api/students/register", {
        name,
        email,
        password,
      });
      toast.success("Registration successful! Please login.");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        toast.error("This email is already registered! Please Login.");
      } else {
        toast.error("Registration failed!");
        console.error(err);
      }
    }
  };

  // ------------ Student Login ------------
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("Email & password required!");
    }

    try {
      const res = await axios.post("http://localhost:8080/api/students/login", {
        email,
        password,
      });
      toast.success("Login successful!");
      setStudentId(res.data.id);
      localStorage.setItem("studentId", res.data.id);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        toast.error("Invalid email or password!");
      } else {
        toast.error("Login failed!");
        console.error(err);
      }
    }
  };

  // ------------ Logout ------------
  const handleLogout = () => {
    localStorage.removeItem("studentId");
    setStudentId("");
    setComplaints([]);
    toast.info("Logged out successfully!");
  };

  // ------------ Submit Complaint ------------
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();

    if (!complaintText.trim()) {
      return toast.error("Complaint should not be empty!");
    }

    if (!studentId) return toast.error("Please login first!");

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8080/api/students/${studentId}/complaints`,
        { description: complaintText }
      );
      toast.success("Complaint Submitted!");
      setComplaintText("");
      fetchComplaints();
    } catch (err) {
      console.error(err);
      toast.error("Complaint Submission Failed!");
    } finally {
      setLoading(false);
    }
  };

  // ------------ Fetch Complaints ------------
  const fetchComplaints = async () => {
    if (!studentId) return;

    try {
      const res = await axios.get(
        `http://localhost:8080/api/students/${studentId}/complaints`
      );
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch complaints!");
    }
  };

  // ------------ Polling Effect ------------
  useEffect(() => {
    if (!studentId) return;

    fetchComplaints();
    const interval = setInterval(fetchComplaints, 5000);
    return () => clearInterval(interval);
  }, [studentId]);

  // ------------ Badge styles ------------
  const badgeStyle = {
    PENDING: {
      color: "white",
      background: "#e74c3c",
      padding: "5px 10px",
      borderRadius: "6px",
      fontWeight: "bold",
    },
    IN_PROGRESS: {
      color: "black",
      background: "#f1c40f",
      padding: "5px 10px",
      borderRadius: "6px",
      fontWeight: "bold",
    },
    RESOLVED: {
      color: "white",
      background: "#2ecc71",
      padding: "5px 10px",
      borderRadius: "6px",
      fontWeight: "bold",
    },
  };

  // ------------ Render ------------
  return (
    <div>
    {/* ---------- Title (separated) ---------- */}
      <div style={{ textAlign: "center", marginTop: "10px", marginBottom: "20px" ,marginLeft:"50px" }}>
        <h1 style={{ color: "#0a0af8ff", fontFamily: "Arial, sans-serif" }}>
          Hostel Complaints<br /> Management System.
        </h1>
      </div>

      {/* ---------- Cards Container ---------- */}
      <div style={{ maxWidth: "400px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
        {/* ---------- Registration / Login Card ---------- */}
        <div
          style={{
            border: "1px solid #e9dadaff",
            borderRadius: "12px",
            padding: "15px",
            marginBottom: "20px",
            boxShadow: "3px 3px 15px rgba(0,0,0,0.1)",
            background: "#fafafa",
          }}
        >
          {/*   <ToastContainer /> */}
          <h2 style={{ color: "#34495e", marginBottom: "20px" }}>Student Register / Login</h2>
          <input
            type="text"
            placeholder="Name (only for register)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          /> <br /><br />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          /> <br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "80%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          /> <br /><br />

          {/* Register & Login Buttons */}
          <div style={{ marginTop: "10px" }}>
            <button
              onClick={handleRegister}
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#3498db",
                color: "white",
                fontWeight: "bold",
                border: "none",
                marginRight: "10px",
              }}
            >
              Register
            </button>
            <button
              onClick={handleLogin}
              style={{
                padding: "10px 20px",
                borderRadius: "30px",
                cursor: "pointer",
                background: "#4CAF50",
                color: "white",
                fontWeight: "bold",
                border: "none",
              }}
            >
              Login
            </button>
          </div>

          {/* Logout Button */}
          {studentId && (
            <div style={{ marginTop: "15px" }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 20px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  background: "#F44336",
                  color: "white",
                  fontWeight: "bold",
                  border: "none",
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* ---------- Complaint Form Card ---------- */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "30px",
            boxShadow: "3px 3px 15px rgba(0,0,0,0.1)",
            background: "#fff",
          }}
        >
          {/* ---------- Complaint Form ---------- */}
          <h2 style={{ color: "#34495e", marginBottom: "20px" }}>Submit Complaint</h2>
          <form onSubmit={handleComplaintSubmit}>
            <textarea
              placeholder="Enter your complaint"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              style={{
                width: "90%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                minHeight: "80px",
              }}
            />
            <br /><br />
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                background: "#e67e22",
                color: "white",
                fontWeight: "bold",
                border: "none",
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>

        {/* ---------- Complaints List Card ---------- */}
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "25px",
            boxShadow: "3px 3px 15px rgba(0,0,0,0.1)",
            background: "#f9f9f9",
          }}
        >
          {/* ---------- Complaints List ---------- */}
          <h2 style={{ color: "#34495e", marginBottom: "15px" }}>Your Complaints</h2>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {complaints.length > 0 ? (
              complaints.map((c, idx) => (
                <li
                  key={idx}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "12px",
                    marginBottom: "12px",
                    boxShadow: "1px 1px 5px rgba(0,0,0,0.1)",
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={badgeStyle[c.status]}>{c.status}</span>
                  <span>{c.description}</span>
                </li>
              ))
            ) : (
              <p>No complaints found</p>
            )}
          </ul>
        </div>

        {/* ---------- Toast Container ---------- */}
        <ToastContainer position="top-right" autoClose={2200} />
      </div>
    </div>
  );
}

export default StudentPage;
