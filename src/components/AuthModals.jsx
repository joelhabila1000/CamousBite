export function LoginModal({ open, onClose, onSwitch, onLogin }) {
  return (
    <div
      className={`modal-overlay ${open ? "open" : ""}`}
      id="loginModal"
      onClick={(event) => {
        if (event.target.id === "loginModal") onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <h2>Welcome back 👋</h2>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p className="sub">Sign in to your CampusBite account</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <div className="f-group">
              <label>Email / Student ID</label>
              <input className="f-inp" type="email" placeholder="student@university.edu.ng" />
            </div>
            <div className="f-group">
              <label>Password</label>
              <input className="f-inp" type="password" placeholder="••••••••" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: ".8rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 7, cursor: "pointer" }}>
                <input type="checkbox" /> Remember me
              </label>
              <a href="#" style={{ color: "var(--orange)", textDecoration: "none" }}>
                Forgot password?
              </a>
            </div>
            <button className="btn btn-primary btn-full" onClick={onLogin}>
              Sign In →
            </button>
            <p style={{ textAlign: "center", fontSize: ".82rem", color: "var(--text2)" }}>
              No account?{" "}
              <a
                href="#"
                style={{ color: "var(--orange)", textDecoration: "none" }}
                onClick={(event) => {
                  event.preventDefault();
                  onSwitch();
                }}
              >
                Sign Up free
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SignupModal({ open, onClose, onSwitch, onRegister }) {
  return (
    <div
      className={`modal-overlay ${open ? "open" : ""}`}
      id="signupModal"
      onClick={(event) => {
        if (event.target.id === "signupModal") onClose();
      }}
    >
      <div className="modal">
        <div className="modal-head">
          <h2>Join CampusBite 🎓</h2>
          <button className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <p className="sub">Create your free student account</p>
          <div className="form-grid">
            <div className="f-group">
              <label>First Name</label>
              <input className="f-inp" placeholder="John" />
            </div>
            <div className="f-group">
              <label>Last Name</label>
              <input className="f-inp" placeholder="Doe" />
            </div>
            <div className="f-group">
              <label>Student / Staff ID</label>
              <input className="f-inp" placeholder="STU/2024/0001" />
            </div>
            <div className="f-group">
              <label>Department</label>
              <input className="f-inp" placeholder="Computer Science" />
            </div>
            <div className="f-group full">
              <label>University Email</label>
              <input className="f-inp" type="email" placeholder="john.doe@university.edu.ng" />
            </div>
            <div className="f-group full">
              <label>Default Delivery Address</label>
              <input className="f-inp" placeholder="Room 14, Block B, Hall 3" />
            </div>
            <div className="f-group">
              <label>Password</label>
              <input className="f-inp" type="password" placeholder="••••••••" />
            </div>
            <div className="f-group">
              <label>Confirm Password</label>
              <input className="f-inp" type="password" placeholder="••••••••" />
            </div>
          </div>
          <button className="btn btn-primary btn-full" style={{ marginTop: 18 }} onClick={onRegister}>
            Create Account →
          </button>
          <p
            style={{ textAlign: "center", fontSize: ".82rem", color: "var(--text2)", marginTop: 14 }}
          >
            Have an account?{" "}
            <a
              href="#"
              style={{ color: "var(--orange)", textDecoration: "none" }}
              onClick={(event) => {
                event.preventDefault();
                onSwitch();
              }}
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
