import { CalendarClock, LogOut, Save, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const formatDate = (value) => {
  if (!value) return "Not recorded yet";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
};

export default function Dashboard() {
  const { user, logout, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio || ""
  });
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setMessage("");
    setBusy(true);

    try {
      await updateProfile(form);
      setMessage("Profile updated");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="dashboard-layout">
      <aside className="profile-summary">
        <div className="avatar">
          <UserRound size={42} />
        </div>
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <span className="role-badge">
          <ShieldCheck size={15} />
          {user.role}
        </span>
        <button className="ghost-button" type="button" onClick={logout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <div className="dashboard-main">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Protected route</p>
            <h2>Profile dashboard</h2>
          </div>
          <div className="token-card">
            <CalendarClock size={20} />
            <span>Last login</span>
            <strong>{formatDate(user.lastLoginAt)}</strong>
          </div>
        </div>

        <form className="profile-editor" onSubmit={saveProfile}>
          <label>
            <span>Name</span>
            <input name="name" value={form.name} onChange={updateField} minLength={2} required />
          </label>

          <label>
            <span>Bio</span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={updateField}
              maxLength={220}
              rows={5}
              placeholder="Add a short profile note"
            />
          </label>

          <div className="editor-actions">
            <p>{message}</p>
            <button className="primary-button compact" type="submit" disabled={busy}>
              <Save size={18} />
              {busy ? "Saving..." : "Save profile"}
            </button>
          </div>
        </form>

        <div className="info-grid">
          <div>
            <strong>Access protected</strong>
            <span>Frontend route requires an active session.</span>
          </div>
          <div>
            <strong>Backend guarded</strong>
            <span>`/api/users/me` checks the bearer token.</span>
          </div>
          <div>
            <strong>Refresh rotated</strong>
            <span>New refresh cookies replace old tokens.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
