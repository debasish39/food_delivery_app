import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("fd-theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("fd-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="app-root">
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-text)",
            borderRadius: "12px",
            border: "1px solid var(--toast-border)",
            fontFamily: "'Sora', sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            padding: "12px 18px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          },
          success: {
            iconTheme: { primary: "#FF6B2B", secondary: "#fff" },
          },
        }}
      />

      <Navbar theme={theme} onToggleTheme={toggleTheme} />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;