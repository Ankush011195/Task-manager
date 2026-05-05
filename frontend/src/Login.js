import { useState } from "react";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return alert("All fields are required");
    if (!email.includes("@")) return alert("Enter valid email");

    try {
      const res = await fetch("https://task-manager-ibsf.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) return alert(data.message);

      // ✅ token + user dono save ho rahe hain
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("userRole", data.user.role);
      localStorage.setItem("userName", data.user.name);

      window.location.reload();
    } catch (err) {
      alert("Something went wrong");
    }
  };

  return (
    <div className="auth-box">
      <h2>Login</h2>

      <input
        placeholder="Enter email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Enter password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="primary-btn" onClick={handleLogin}>
        Sign In
      </button>

      <button
        className="secondary-btn"
       onClick={() => {
  window.history.pushState({}, "", "/register");
  window.location.reload();
}}
      >
        Create Account
      </button>
    </div>
  );
}

export default Login;