import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const GOALS = [
  { id: "muscle", label: "Muscle Gain", icon: "💪", desc: "Build strength & size" },
  { id: "fatloss", label: "Fat Loss", icon: "🔥", desc: "Burn calories & lean out" },
  { id: "endurance", label: "Endurance", icon: "🏃", desc: "Improve stamina & cardio" },
  { id: "flexibility", label: "Flexibility", icon: "🧘", desc: "Mobility & stretching" },
  { id: "general", label: "General Fitness", icon: "⚡", desc: "Overall health & wellness" },
];

const EQUIPMENT = [
  { id: "bodyweight", label: "No Equipment", icon: "🙌", desc: "Bodyweight only" },
  { id: "dumbbells", label: "Dumbbells / Barbells", icon: "🏋️", desc: "Free weights" },
  { id: "machines", label: "Gym Machines", icon: "🏟️", desc: "Cable & machines" },
  { id: "bands", label: "Resistance Bands", icon: "〰️", desc: "Elastic bands" },
];

const LEVELS = [
  { id: "beginner", label: "Beginner", desc: "0–6 months of training" },
  { id: "intermediate", label: "Intermediate", desc: "6 months–2 years" },
  { id: "advanced", label: "Advanced", desc: "2+ years consistent training" },
];

const DAYS = [1, 2, 3, 4, 5, 6, 7];

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
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
    --accent2: #E76F51;
    --radius: 14px;
    --shadow: 0 2px 16px rgba(0,0,0,0.06);
  }

  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .header {
    padding: 22px 40px; display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid var(--border); background: var(--surface);
    position: sticky; top: 0; z-index: 10;
  }
  .logo-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--accent); }
  .logo-text { font-family: 'DM Serif Display', serif; font-size: 1.2rem; }
  .logo-text span { color: var(--accent); }

  .main { flex: 1; display: grid; grid-template-columns: 340px 1fr; min-height: calc(100vh - 65px); }

  .left-panel {
    padding: 52px 44px; display: flex; flex-direction: column; justify-content: center;
    border-right: 1px solid var(--border); background: var(--surface);
    position: sticky; top: 65px; height: calc(100vh - 65px);
  }
  .step-badge {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--accent-light); color: var(--accent);
    font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 5px 12px; border-radius: 100px; margin-bottom: 28px; width: fit-content;
  }
  .hero-title { font-family: 'DM Serif Display', serif; font-size: 2.6rem; line-height: 1.1; letter-spacing: -0.02em; margin-bottom: 14px; }
  .hero-title em { font-style: italic; color: var(--accent); }
  .hero-sub { font-size: 0.92rem; color: var(--text-muted); line-height: 1.65; margin-bottom: 52px; font-weight: 300; }

  .progress-steps { display: flex; flex-direction: column; }
  .progress-step { display: flex; align-items: center; gap: 14px; padding: 6px 0; }
  .step-circle {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 600; flex-shrink: 0; transition: all 0.4s ease;
  }
  .step-circle.done { background: var(--accent); color: white; }
  .step-circle.active { background: var(--accent); color: white; box-shadow: 0 0 0 5px var(--accent-light); }
  .step-circle.pending { background: var(--surface2); color: var(--text-muted); border: 1.5px solid var(--border); }
  .step-connector { width: 1.5px; height: 20px; background: var(--border); margin-left: 14px; }
  .step-label { font-size: 0.85rem; font-weight: 500; color: var(--text-muted); transition: color 0.3s; }
  .step-label.active { color: var(--text); font-weight: 600; }
  .step-label.done { color: var(--accent); }

  .right-panel { padding: 48px 56px; overflow-y: auto; background: var(--bg); }

  /* Form */
  .form-section { margin-bottom: 38px; animation: fadeUp 0.35s ease both; }
  .form-section:nth-child(2) { animation-delay: 0.05s; }
  .form-section:nth-child(3) { animation-delay: 0.1s; }
  .form-section:nth-child(4) { animation-delay: 0.15s; }
  .form-section:nth-child(5) { animation-delay: 0.2s; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  .section-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 12px; }

  .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .option-card {
    background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius);
    padding: 16px; cursor: pointer; transition: all 0.2s ease; user-select: none; position: relative;
  }
  .option-card:hover { border-color: var(--accent); transform: translateY(-1px); box-shadow: var(--shadow); }
  .option-card.selected { border-color: var(--accent); background: var(--accent-light); }
  .option-card.selected::after { content: '✓'; position: absolute; top: 10px; right: 12px; font-size: 0.75rem; color: var(--accent); font-weight: 700; }
  .card-icon { font-size: 1.3rem; margin-bottom: 7px; }
  .card-title { font-size: 0.85rem; font-weight: 600; margin-bottom: 2px; }
  .card-desc { font-size: 0.73rem; color: var(--text-muted); font-weight: 300; }

  .level-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .level-card {
    background: var(--surface); border: 1.5px solid var(--border); border-radius: var(--radius);
    padding: 18px 12px; cursor: pointer; transition: all 0.2s ease; text-align: center; user-select: none;
  }
  .level-card:hover { border-color: var(--accent); }
  .level-card.selected { border-color: var(--accent); background: var(--accent-light); }
  .level-name { font-size: 0.88rem; font-weight: 600; margin-bottom: 4px; }
  .level-desc { font-size: 0.7rem; color: var(--text-muted); }

  .days-row { display: flex; gap: 8px; flex-wrap: wrap; }
  .day-btn {
    width: 44px; height: 44px; border-radius: 50%; border: 1.5px solid var(--border);
    background: var(--surface); font-size: 0.85rem; font-weight: 600; cursor: pointer;
    transition: all 0.2s ease; display: flex; align-items: center; justify-content: center;
    font-family: 'DM Sans', sans-serif; color: var(--text);
  }
  .day-btn:hover { border-color: var(--accent); }
  .day-btn.selected { background: var(--accent); color: white; border-color: var(--accent); }

  .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .input-wrap { display: flex; flex-direction: column; gap: 5px; }
  .input-hint { font-size: 0.72rem; color: var(--text-muted); }
  .single-input {
    width: 100%; padding: 12px 15px; border: 1.5px solid var(--border); border-radius: var(--radius);
    background: var(--surface); font-family: 'DM Sans', sans-serif; font-size: 0.88rem; color: var(--text); outline: none; transition: border-color 0.2s;
  }
  .single-input:focus { border-color: var(--accent); }

  .cta-row { margin-top: 8px; padding-top: 28px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; gap: 16px; }
  .cta-note { font-size: 0.78rem; color: var(--text-muted); max-width: 220px; line-height: 1.5; }
  .cta-btn {
    display: flex; align-items: center; gap: 10px;
    background: var(--accent); color: white; border: none; border-radius: 100px;
    padding: 14px 30px; font-family: 'DM Sans', sans-serif; font-size: 0.88rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s ease; white-space: nowrap;
  }
  .cta-btn:hover:not(:disabled) { background: #235c42; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(45,106,79,0.3); }
  .cta-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .arrow { transition: transform 0.2s; }
  .cta-btn:hover:not(:disabled) .arrow { transform: translateX(4px); }

  /* Loading */
  .loading-screen {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 70vh; gap: 28px; animation: fadeUp 0.4s ease;
  }
  .loader-ring {
    width: 72px; height: 72px; border-radius: 50%;
    border: 3px solid var(--border); border-top-color: var(--accent);
    animation: spin 0.9s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; text-align: center; }
  .loading-sub { font-size: 0.88rem; color: var(--text-muted); text-align: center; max-width: 320px; line-height: 1.6; }
  .loading-steps { display: flex; flex-direction: column; gap: 10px; margin-top: 8px; }
  .loading-step {
    display: flex; align-items: center; gap: 10px; font-size: 0.82rem; color: var(--text-muted);
    padding: 10px 18px; background: var(--surface); border-radius: 100px; border: 1px solid var(--border);
    animation: fadeUp 0.4s ease both;
  }
  .loading-step:nth-child(1) { animation-delay: 0.1s; }
  .loading-step:nth-child(2) { animation-delay: 0.6s; }
  .loading-step:nth-child(3) { animation-delay: 1.2s; }
  .loading-step.lit { color: var(--accent); border-color: var(--accent-light); background: var(--accent-light); }
  .ls-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; flex-shrink: 0; }
  .error-box {
    background: #FEF2F2; border: 1px solid #FECACA; border-radius: var(--radius);
    padding: 20px 28px; color: #B91C1C; font-size: 0.85rem; line-height: 1.6;
    max-width: 440px; text-align: center;
  }
  .retry-btn {
    margin-top: 16px; padding: 10px 24px; background: var(--accent); color: white;
    border: none; border-radius: 100px; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 600; cursor: pointer;
  }
  .retry-btn:hover { background: #235c42; }

  /* Plan */
  .plan-screen { animation: fadeUp 0.4s ease; }
  .plan-header { margin-bottom: 32px; }
  .plan-title { font-family: 'DM Serif Display', serif; font-size: 2rem; margin-bottom: 8px; }
  .plan-title span { color: var(--accent); }
  .plan-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
  .meta-chip {
    display: inline-flex; align-items: center; gap: 6px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 100px; padding: 6px 14px; font-size: 0.78rem; color: var(--text-muted);
  }
  .meta-chip strong { color: var(--text); font-weight: 600; }

  .plan-intro {
    background: var(--accent-light); border-left: 3px solid var(--accent);
    border-radius: 0 var(--radius) var(--radius) 0;
    padding: 16px 20px; font-size: 0.88rem; line-height: 1.7; color: var(--text); margin-bottom: 28px;
  }

  .days-nav { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 24px; }
  .day-tab {
    padding: 8px 18px; border-radius: 100px; border: 1.5px solid var(--border);
    background: var(--surface); font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all 0.2s; color: var(--text-muted);
  }
  .day-tab:hover { border-color: var(--accent); color: var(--accent); }
  .day-tab.active { background: var(--accent); color: white; border-color: var(--accent); }
  .day-tab.rest { border-style: dashed; }

  .day-card { background: var(--surface); border-radius: var(--radius); border: 1px solid var(--border); overflow: hidden; margin-bottom: 20px; }
  .day-card-header { padding: 18px 22px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .day-card-title { font-family: 'DM Serif Display', serif; font-size: 1.2rem; }
  .day-card-focus { font-size: 0.75rem; color: var(--text-muted); background: var(--surface2); padding: 4px 12px; border-radius: 100px; }

  .exercise-table { width: 100%; border-collapse: collapse; }
  .exercise-table th { text-align: left; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-muted); padding: 10px 22px; background: var(--surface2); }
  .exercise-table td { padding: 14px 22px; border-top: 1px solid var(--border); font-size: 0.85rem; vertical-align: top; }
  .exercise-table tr:hover td { background: var(--bg); }
  .ex-name { font-weight: 600; color: var(--text); }
  .ex-tip { font-size: 0.75rem; color: var(--text-muted); margin-top: 3px; font-weight: 300; }
  .ex-sets { font-weight: 600; color: var(--accent); }
  .ex-reps { color: var(--text-muted); font-size: 0.82rem; }

  .rest-day-card { background: var(--surface); border-radius: var(--radius); border: 1.5px dashed var(--border); padding: 48px 24px; text-align: center; }
  .rest-icon { font-size: 2.5rem; margin-bottom: 14px; }
  .rest-title { font-family: 'DM Serif Display', serif; font-size: 1.4rem; margin-bottom: 8px; }
  .rest-sub { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; max-width: 320px; margin: 0 auto; }

  .tips-section { margin-top: 32px; }
  .tips-title { font-family: 'DM Serif Display', serif; font-size: 1.2rem; margin-bottom: 16px; }
  .tips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .tip-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px 18px; }
  .tip-card-label { font-size: 0.68rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin-bottom: 6px; }
  .tip-card-text { font-size: 0.82rem; color: var(--text); line-height: 1.6; font-weight: 300; }

  .plan-footer { margin-top: 40px; padding-top: 28px; border-top: 1px solid var(--border); }
  .restart-btn {
    padding: 12px 26px; border-radius: 100px; border: 1.5px solid var(--border);
    background: var(--surface); font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    font-weight: 600; cursor: pointer; color: var(--text); transition: all 0.2s;
  }
  .restart-btn:hover { border-color: var(--accent); color: var(--accent); }

  @media (max-width: 900px) {
    .main { grid-template-columns: 1fr; }
    .left-panel { display: none; }
    .right-panel { padding: 28px 20px; }
    .card-grid { grid-template-columns: 1fr; }
    .tips-grid { grid-template-columns: 1fr; }
    .input-row { grid-template-columns: 1fr; }
  }
`;

// ─── AI Call ──────────────────────────────────────────────────────────────────

// ─── API Call (calls your Spring Boot backend) ────────────────────────────────

async function generateWorkoutPlan(userProfile) {
  const response = await fetch("/api/workout/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      goals: userProfile.goals,
      equipment: userProfile.equipment,
      level: userProfile.level,
      days: userProfile.days,
      age: userProfile.age ? parseInt(userProfile.age) : null,
      weight: userProfile.weight ? parseFloat(userProfile.weight) : null,
      notes: userProfile.notes || null,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.message || `Server error ${response.status}`);
  }

  return await response.json();
}


// ─── Step 1: Form ─────────────────────────────────────────────────────────────

function StepForm({ onSubmit }) {
  const [goals, setGoals] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [level, setLevel] = useState("");
  const [days, setDays] = useState(null);
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [notes, setNotes] = useState("");

  const toggle = (list, setList, id) =>
    setList(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const isValid = goals.length > 0 && equipment.length > 0 && level && days;
  const missing = [
    !goals.length && "a goal",
    !equipment.length && "equipment",
    !level && "fitness level",
    !days && "workout days",
  ].filter(Boolean);

  return (
    <div className="right-panel">
      <div className="form-section">
        <div className="section-label">What's your primary goal?</div>
        <div className="card-grid">
          {GOALS.map(g => (
            <div key={g.id} className={`option-card ${goals.includes(g.id) ? "selected" : ""}`}
              onClick={() => toggle(goals, setGoals, g.id)}>
              <div className="card-icon">{g.icon}</div>
              <div className="card-title">{g.label}</div>
              <div className="card-desc">{g.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="section-label">Available Equipment</div>
        <div className="card-grid">
          {EQUIPMENT.map(e => (
            <div key={e.id} className={`option-card ${equipment.includes(e.id) ? "selected" : ""}`}
              onClick={() => setEquipment(equipment.includes(e.id) ? [] : [e.id])}>
              <div className="card-icon">{e.icon}</div>
              <div className="card-title">{e.label}</div>
              <div className="card-desc">{e.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="section-label">Fitness Level</div>
        <div className="level-grid">
          {LEVELS.map(l => (
            <div key={l.id} className={`level-card ${level === l.id ? "selected" : ""}`}
              onClick={() => setLevel(l.id)}>
              <div className="level-name">{l.label}</div>
              <div className="level-desc">{l.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="section-label">Days per week you can train</div>
        <div className="days-row">
          {DAYS.map(d => (
            <button key={d} className={`day-btn ${days === d ? "selected" : ""}`}
              onClick={() => setDays(d)}>{d}</button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <div className="section-label">Optional Details</div>
        <div className="input-row">
          <div className="input-wrap">
            <input className="single-input" type="number" placeholder="Your age (e.g. 21)"
              value={age} onChange={e => setAge(e.target.value)} min="10" max="100" />
            <span className="input-hint">Helps tailor intensity & recovery</span>
          </div>
          <div className="input-wrap">
            <input className="single-input" type="number" placeholder="Your weight in kg (e.g. 70)"
              value={weight} onChange={e => setWeight(e.target.value)} min="20" max="300" />
            <span className="input-hint">Used to personalise your plan</span>
          </div>
          <div className="input-wrap">
            <input className="single-input" type="text" placeholder="Any injuries or limitations?"
              value={notes} onChange={e => setNotes(e.target.value)} />
            <span className="input-hint">e.g. bad knees, lower back pain</span>
          </div>
        </div>
      </div>

      <div className="cta-row">
        <div className="cta-note">
          {!isValid ? `Select ${missing.join(", ")} to continue.` : "Ready! Your AI plan generates instantly."}
        </div>
        <button className="cta-btn" disabled={!isValid}
          onClick={() => onSubmit({ goals, equipment, level, days, age, weight, notes })}>
          Generate My Plan <span className="arrow">→</span>
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Loading ──────────────────────────────────────────────────────────

function StepLoading({ error, onRetry }) {
  return (
    <div className="right-panel">
      <div className="loading-screen">
        {!error ? (
          <>
            <div className="loader-ring" />
            <div style={{ textAlign: "center" }}>
              <div className="loading-title">Building your plan…</div>
              <div className="loading-sub">Our AI is crafting a personalised workout schedule just for you.</div>
            </div>
            <div className="loading-steps">
              <div className="loading-step lit"><div className="ls-dot" /> Analysing your profile</div>
              <div className="loading-step lit"><div className="ls-dot" /> Selecting optimal exercises</div>
              <div className="loading-step"><div className="ls-dot" /> Structuring your weekly plan</div>
            </div>
          </>
        ) : (
          <div className="error-box">
            <strong>Something went wrong</strong><br /><br />
            {error}<br />
            <button className="retry-btn" onClick={onRetry}>Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Step 3: Plan Display ─────────────────────────────────────────────────────

function StepPlan({ plan, profile, onRestart }) {
  const [activeDay, setActiveDay] = useState(0);
  const goalLabels = profile.goals.map(g => GOALS.find(x => x.id === g)?.label).join(", ");
  const levelLabel = LEVELS.find(x => x.id === profile.level)?.label;
  const currentDay = plan.weekSchedule[activeDay];

  return (
    <div className="right-panel">
      <div className="plan-screen">
        <div className="plan-header">
          <div className="plan-title">Your <span>{plan.planTitle}</span></div>
          <div className="plan-meta">
            <div className="meta-chip">🎯 <strong>{goalLabels}</strong></div>
            <div className="meta-chip">📊 <strong>{levelLabel}</strong></div>
            <div className="meta-chip">📅 <strong>{profile.days} days/week</strong></div>
          </div>
        </div>

        <div className="plan-intro">{plan.intro}</div>

        <div className="days-nav">
          {plan.weekSchedule.map((d, i) => (
            <button key={i}
              className={`day-tab ${i === activeDay ? "active" : ""} ${d.isRest ? "rest" : ""}`}
              onClick={() => setActiveDay(i)}>
              {d.label}
            </button>
          ))}
        </div>

        {currentDay.isRest ? (
          <div className="rest-day-card">
            <div className="rest-icon">🌿</div>
            <div className="rest-title">Rest & Recovery Day</div>
            <div className="rest-sub">Your muscles grow during rest. Use today for light walking, stretching, or foam rolling. Stay hydrated and sleep well.</div>
          </div>
        ) : (
          <div className="day-card">
            <div className="day-card-header">
              <div className="day-card-title">{currentDay.label}</div>
              <div className="day-card-focus">{currentDay.focus}</div>
            </div>
            <table className="exercise-table">
              <thead>
                <tr>
                  <th>Exercise</th>
                  <th>Sets</th>
                  <th>Reps / Duration</th>
                  <th>Rest</th>
                </tr>
              </thead>
              <tbody>
                {currentDay.exercises.map((ex, i) => (
                  <tr key={i}>
                    <td>
                      <div className="ex-name">{ex.name}</div>
                      {ex.tip && <div className="ex-tip">💡 {ex.tip}</div>}
                    </td>
                    <td><span className="ex-sets">{ex.sets}</span></td>
                    <td><span className="ex-reps">{ex.reps}</span></td>
                    <td><span className="ex-reps">{ex.rest}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {plan.generalTips?.length > 0 && (
          <div className="tips-section">
            <div className="tips-title">General Tips</div>
            <div className="tips-grid">
              {plan.generalTips.map((t, i) => (
                <div key={i} className="tip-card">
                  <div className="tip-card-label">{t.label}</div>
                  <div className="tip-card-text">{t.text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="plan-footer">
          <button className="restart-btn" onClick={onRestart}>← Start Over</button>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [error, setError] = useState(null);

  const stepLabels = ["Your Profile", "AI Generation", "Your Plan"];

  const handleFormSubmit = async (data) => {
    setProfile(data);
    setStep(2);
    setError(null);
    try {
      const result = await generateWorkoutPlan(data);
      setPlan(result);
      setStep(3);
    } catch (err) {
      setError(err.message || "Unexpected error. Please try again.");
    }
  };

  const handleRetry = async () => {
    setError(null);
    try {
      const result = await generateWorkoutPlan(profile);
      setPlan(result);
      setStep(3);
    } catch (err) {
      setError(err.message || "Unexpected error. Please try again.");
    }
  };

  const handleRestart = () => { setStep(1); setProfile(null); setPlan(null); setError(null); };

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo-dot" />
          <div className="logo-text">Form<span>Fit</span></div>
        </header>

        <div className="main">
          {/* Left panel — always visible */}
          <div className="left-panel">
            <div className="step-badge"><span>🌿</span> AI-Powered Planner</div>
            <h1 className="hero-title">Build your <em>perfect</em> workout plan.</h1>
            <p className="hero-sub">Answer a few quick questions and our AI will craft a personalised training plan tailored to your body, goals, and lifestyle.</p>
            <div className="progress-steps">
              {stepLabels.map((label, i) => {
                const n = i + 1;
                const state = step > n ? "done" : step === n ? "active" : "pending";
                return (
                  <div key={i}>
                    {i > 0 && <div className="step-connector" />}
                    <div className="progress-step">
                      <div className={`step-circle ${state}`}>{state === "done" ? "✓" : n}</div>
                      <span className={`step-label ${state}`}>{label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          {step === 1 && <StepForm onSubmit={handleFormSubmit} />}
          {step === 2 && <StepLoading error={error} onRetry={handleRetry} />}
          {step === 3 && plan && <StepPlan plan={plan} profile={profile} onRestart={handleRestart} />}
        </div>
      </div>
    </>
  );
}