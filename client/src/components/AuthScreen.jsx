import { LockKeyhole, Mail, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "",
  email: "",
  password: ""
};

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login, signup } = useAuth();

  const isSignup = mode === "signup";

  const strength = useMemo(() => {
    const score = [
      form.password.length >= 8,
      /[A-Z]/.test(form.password),
      /[0-9]/.test(form.password),
      /[^A-Za-z0-9]/.test(form.password)
    ].filter(Boolean).length;

    return score;
  }, [form.password]);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (isSignup) {
        await signup(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <div className="security-visual" aria-hidden="true">
          <div className="vault-card card-one" />
          <div className="vault-card card-two" />
          <div className="vault-core">
            <LockKeyhole size={48} strokeWidth={1.8} />
          </div>
        </div>
        <p className="eyebrow">Secure account workspace</p>
        <h1>Sign in, refresh silently, and manage your profile with confidence.</h1>
        <p>
          A production-shaped authentication flow with hashed passwords, protected routes,
          short-lived access tokens, and cookie-based refresh sessions.
        </p>
        <div className="metric-row">
          <div>
            <strong>15m</strong>
            <span>access token</span>
          </div>
          <div>
            <strong>7d</strong>
            <span>refresh window</span>
          </div>
          <div>
            <strong>bcrypt</strong>
            <span>password hashing</span>
          </div>
        </div>
      </div>

      <form className="auth-panel" onSubmit={submit}>
        <div className="segmented-control" aria-label="Authentication mode">
          <button
            className={mode === "login" ? "active" : ""}
            type="button"
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "signup" ? "active" : ""}
            type="button"
            onClick={() => setMode("signup")}
          >
            Signup
          </button>
        </div>

        <div className="form-heading">
          <h2>{isSignup ? "Create your account" : "Welcome back"}</h2>
          <p>{isSignup ? "Start with a secure profile." : "Continue to your dashboard."}</p>
        </div>

        {isSignup && (
          <label className="input-field">
            <UserRound size={18} />
            <input
              name="name"
              value={form.name}
              onChange={updateField}
              placeholder="Full name"
              autoComplete="name"
              required
            />
          </label>
        )}

        <label className="input-field">
          <Mail size={18} />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="Email address"
            autoComplete="email"
            required
          />
        </label>

        <label className="input-field">
          <LockKeyhole size={18} />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            placeholder="Password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            minLength={8}
            required
          />
        </label>

        {isSignup && (
          <div className="strength-meter" aria-label="Password strength">
            <span className={strength >= 1 ? "filled" : ""} />
            <span className={strength >= 2 ? "filled" : ""} />
            <span className={strength >= 3 ? "filled" : ""} />
            <span className={strength >= 4 ? "filled" : ""} />
          </div>
        )}

        {error && <p className="form-error">{error}</p>}

        <button className="primary-button" type="submit" disabled={busy}>
          {busy ? "Please wait..." : isSignup ? "Create account" : "Login"}
        </button>
      </form>
    </section>
  );
}
