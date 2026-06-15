import { useState } from "react";
import { registerUser, loginUser, saveAuth } from "../api/auth";

const authStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #F7F6F3;
    --surface: #FFFFFF;
    --surface2: #F0EFEB;
    --border: #E5E3DD;
    --text: #1A1916;
    --text-muted: #8A8780;
    --accent: #2D6A4F;
    --accent-light: #EAF2EE;
    --radius: 14px;
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    padding: 24px;
  }

  .auth-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    max-width: 860px;
    min-height: 580px;
    border-radius: 24px;
    overflow: hidden;
    border: 1px solid var(--border);
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
  }

  /* ── Left panel ── */
  .auth-left {
    background: var(--accent);
    padding: 52px 44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    overflow: hidden;
  }
  .auth-left::before {
    content: '';
    position: absolute;
    width: 300px; height: 300px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.1);
    top: -80px; right: -80px;
    pointer-events: none;
  }
  .auth-left::after {
    content: '';
    position: absolute;
    width: 200px; height: 200px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.07);
    bottom: 30px; left: -70px;
    pointer-events: none;
  }

  .auth-logo {
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;
    z-index: 1;
  }
  .auth-logo-dot {
    width: 9px; height: 9px;
    border-radius: 50%;
    background: #fff;
  }
  .auth-logo-text {
    font-family: 'DM Serif Display', serif;
    font-size: 1.1rem;
    color: #fff;
  }

  .auth-hero {
    position: relative;
    z-index: 1;
  }
  .auth-hero-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.9);
    font-size: 0.68rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 100px;
    margin-bottom: 20px;
  }
  .auth-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.4rem;
    line-height: 1.1;
    color: #fff;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }
  .auth-hero-title em {
    font-style: italic;
    opacity: 0.8;
  }
  .auth-hero-sub {
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
    line-height: 1.75;
    font-weight: 300;
    max-width: 260px;
  }

  .auth-features {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 1;
  }
  .auth-feat {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.8rem;
    color: rgba(255,255,255,0.75);
  }
  .auth-feat-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.45);
    flex-shrink: 0;
  }

  /* ── Right panel ── */
  .auth-right {
    background: var(--surface);
    padding: 52px 44px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .auth-tab-row {
    display: flex;
    background: var(--surface2);
    border-radius: 100px;
    padding: 4px;
    margin-bottom: 36px;
    width: fit-content;
  }
  .auth-tab {
    padding: 8px 24px;
    border-radius: 100px;
    font-size: 0.82rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-muted);
    transition: all 0.2s;
  }
  .auth-tab.active {
    background: var(--surface);
    color: var(--text);
    box-shadow: 0 1px 6px rgba(0,0,0,0.08);
  }

  .auth-form-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.65rem;
    color: var(--text);
    margin-bottom: 4px;
  }
  .auth-form-sub {
    font-size: 0.83rem;
    color: var(--text-muted);
    margin-bottom: 30px;
    font-weight: 300;
    line-height: 1.6;
  }

  .auth-error {
    background: #FEF2F2;
    border: 1px solid #FECACA;
    border-radius: 10px;
    padding: 11px 15px;
    color: #B91C1C;
    font-size: 0.8rem;
    margin-bottom: 16px;
    line-height: 1.5;
  }

  .auth-field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    margin-bottom: 14px;
  }
  .auth-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-muted);
  }
  .auth-input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid var(--border);
    border-radius: 10px;
    background: var(--bg);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
  }
  .auth-input:focus { border-color: var(--accent); }
  .auth-input::placeholder { color: var(--text-muted); }

  .auth-btn {
    width: 100%;
    padding: 13px;
    background: var(--accent);
    color: #fff;
    border: none;
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.88rem;
    font-weight: 600;
    cursor: pointer;
    margin-top: 6px;
    transition: all 0.2s;
    letter-spacing: 0.01em;
  }
  .auth-btn:hover:not(:disabled) {
    background: #235c42;
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(45,106,79,0.25);
  }
  .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .auth-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 18px 0;
    color: var(--text-muted);
    font-size: 0.75rem;
  }
  .auth-divider::before,
  .auth-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  .auth-google-btn {
    width: 100%;
    padding: 11px;
    background: var(--surface);
    color: var(--text);
    border: 1.5px solid var(--border);
    border-radius: 100px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 9px;
    transition: border-color 0.2s;
  }
  .auth-google-btn:hover { border-color: var(--accent); }

  .auth-footer-note {
    text-align: center;
    margin-top: 22px;
    font-size: 0.78rem;
    color: var(--text-muted);
  }
  .auth-footer-note button {
    background: none;
    border: none;
    color: var(--accent);
    font-weight: 600;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    padding: 0;
    margin-left: 3px;
  }
  .auth-footer-note button:hover { text-decoration: underline; }

  @media (max-width: 700px) {
    .auth-card { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 40px 28px; }
  }
`;

const GoogleIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
);

export default function AuthPage({ onAuth }) {
    const [mode, setMode] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isLogin = mode === "login";

    const switchMode = (next) => {
        setMode(next);
        setError("");
        setName("");
        setEmail("");
        setPassword("");
    };

    const handleSubmit = async () => {
        setError("");
        if (!email || !password || (!isLogin && !name)) {
            setError("Please fill in all fields.");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);
        try {
            const data = isLogin
                ? await loginUser({ email, password })
                : await registerUser({ name, email, password });
            saveAuth(data);
            onAuth(data);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{authStyles}</style>
            <div className="auth-page">
                <div className="auth-card">

                    {/* ── Left panel ── */}
                    <div className="auth-left">
                        <div className="auth-logo">
                            <div className="auth-logo-dot" />
                            <div className="auth-logo-text">FormFit</div>
                        </div>

                        <div className="auth-hero">
                            <div className="auth-hero-tag">✦ AI-Powered</div>
                            <div className="auth-hero-title">
                                Your <em>perfect</em><br />
                                plan, built<br />
                                by AI.
                            </div>
                            <div className="auth-hero-sub">
                                Answer a few questions. Get a personalised workout plan crafted for your body and goals.
                            </div>
                        </div>

                        <div className="auth-features">
                            <div className="auth-feat"><div className="auth-feat-dot" />Tailored to your fitness level</div>
                            <div className="auth-feat"><div className="auth-feat-dot" />Works with any equipment</div>
                            <div className="auth-feat"><div className="auth-feat-dot" />Regenerate anytime</div>
                        </div>
                    </div>

                    {/* ── Right panel ── */}
                    <div className="auth-right">

                        {/* Tab switcher */}
                        <div className="auth-tab-row">
                            <button
                                className={`auth-tab ${isLogin ? "active" : ""}`}
                                onClick={() => switchMode("login")}
                            >
                                Log in
                            </button>
                            <button
                                className={`auth-tab ${!isLogin ? "active" : ""}`}
                                onClick={() => switchMode("register")}
                            >
                                Sign up
                            </button>
                        </div>

                        {/* Heading */}
                        <div className="auth-form-title">
                            {isLogin ? "Welcome back." : "Get started."}
                        </div>
                        <div className="auth-form-sub">
                            {isLogin
                                ? "Log in to access your workout plans."
                                : "Create an account — it only takes a minute."}
                        </div>

                        {/* Error */}
                        {error && <div className="auth-error">{error}</div>}

                        {/* Name field — register only */}
                        {!isLogin && (
                            <div className="auth-field">
                                <label className="auth-label">Full name</label>
                                <input
                                    className="auth-input"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                        )}

                        <div className="auth-field">
                            <label className="auth-label">Email</label>
                            <input
                                className="auth-input"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="auth-field">
                            <label className="auth-label">Password</label>
                            <input
                                className="auth-input"
                                type="password"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleSubmit()}
                            />
                        </div>

                        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
                            {loading
                                ? "Please wait…"
                                : isLogin ? "Log In" : "Create Account"}
                        </button>

                        <div className="auth-divider">or</div>

                        <button className="auth-google-btn">
                            <GoogleIcon />
                            Continue with Google
                        </button>

                        <div className="auth-footer-note">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}
                            <button onClick={() => switchMode(isLogin ? "register" : "login")}>
                                {isLogin ? "Sign up" : "Log in"}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}