import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [admin, setAdmin] = useState(() => {
    const savedAdmin = localStorage.getItem("admin");
    return savedAdmin ? JSON.parse(savedAdmin) : null;
  });
//  ---------- Handle Login ----------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/admin/login", {
        email: email.trim(),
        password: password.trim(),
      });
      toast.success("Login Successful!");
      localStorage.setItem("admin", JSON.stringify(res.data));
      setAdmin(res.data);
      navigate("/admin");
    } catch (err) {
      toast.error("Invalid credentials!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
// ---------- Handle Logout ----------
  const handleLogout = () => {
    localStorage.removeItem("admin");
    setAdmin(null);
    toast.info("Logged out successfully!");
    navigate("/admin-login");
  };

  return (
    <div
      style={{
        minHeight: "10vh",
        // background: "linear-gradient(135deg, #74ABE2, #5563DE)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: "350px",
          background: "white",
          borderRadius: "15px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          padding: "30px",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#2C3E50", marginBottom: "35px" }}>Admin Login</h2>

        {!admin ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              style={{
                width: "100%",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                background: "#3498db",
                color: "white",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        ) : (
          <div>
            <p style={{ marginBottom: "30px" }}>
              Welcome, <strong>{admin.name}</strong>
            </p>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                background: "#e74c3c",
                color: "white",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
{/*   <ToastContainer /> */}
      <ToastContainer position="top-right" autoClose={2200} />
    </div>
  );
}

export default AdminLogin;
