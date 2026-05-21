import { ShieldCheck } from "lucide-react";
import AuthScreen from "./components/AuthScreen.jsx";
import Dashboard from "./components/Dashboard.jsx";
import LoadingScreen from "./components/LoadingScreen.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { isAuthenticated, status } = useAuth();

  if (status === "loading") {
    return <LoadingScreen />;
  }

  return (
    <main className="app-shell">
      <div className="ambient-grid" aria-hidden="true" />
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">
            <ShieldCheck size={20} strokeWidth={2.2} />
          </span>
          <span>AuthFlow</span>
        </div>
        <span className="status-pill">JWT + Refresh Tokens</span>
      </header>
      {isAuthenticated ? <Dashboard /> : <AuthScreen />}
    </main>
  );
}
