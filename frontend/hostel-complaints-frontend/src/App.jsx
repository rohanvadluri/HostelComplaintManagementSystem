import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StudentPage from "./components/StudentPage";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        {/* Navigation */}
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/student" style={{ marginRight: "10px" }}>Student</Link>
          <Link to="/admin-login">Admin</Link>
        </nav>

        <Routes>
          {/* Default route */}
          <Route path="/" element={<StudentPage />} />
          {/* Student route */}
          <Route path="/student" element={<StudentPage />} />
          {/* Admin login route */}
          <Route path="/admin-login" element={<AdminLogin />} />
          {/* Protected Admin dashboard route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
