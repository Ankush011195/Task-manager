import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {
  const token = localStorage.getItem("token");
  const path = window.location.pathname;

  if (token) return <Dashboard />;

  if (path === "/register") return <Register />;

  return <Login />;
}

export default App;