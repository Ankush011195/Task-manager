import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleRegister = async () => {
    if (!name || !email || !password) return alert("All fields are required");
    if (!email.includes("@")) return alert("Enter valid email");
    if (password.length < 6) return alert("Password must be at least 6 characters");

    try {
      const res = await fetch("https://task-manager-ibsf.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      alert(data.message);
   navigate("/");
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-box">
      <h2>Register</h2>

      <input
        placeholder="Enter name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary-btn" onClick={handleRegister}>
        Create Account
      </button>

      <button className="secondary-btn" onClick={() => navigate("/")}>
        Back to Login
      </button>
    </div>
  );
}

export default Register;