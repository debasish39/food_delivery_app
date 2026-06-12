import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUser } from "../../services/authService";

const foodImages = [
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
  "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&q=80",
];

const floatingIcons = [
  { icon: "🍕", x: "8%", y: "15%", delay: "0s", duration: "6s" },
  { icon: "🍔", x: "85%", y: "10%", delay: "1s", duration: "7s" },
  { icon: "🌮", x: "5%", y: "70%", delay: "2s", duration: "5s" },
  { icon: "🍜", x: "90%", y: "65%", delay: "0.5s", duration: "8s" },
  { icon: "🥗", x: "15%", y: "45%", delay: "3s", duration: "6.5s" },
  { icon: "🍦", x: "80%", y: "40%", delay: "1.5s", duration: "7.5s" },
  { icon: "🧁", x: "50%", y: "5%", delay: "2.5s", duration: "6s" },
  { icon: "🥤", x: "92%", y: "85%", delay: "4s", duration: "5.5s" },
];

export default function Register() {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % foodImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullname || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword)
      return toast.error("All fields are required");
    if (formData.password !== formData.confirmPassword)
      return toast.error("Passwords do not match");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    try {
      setLoading(true);
      const { data } = await registerUser({
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      toast.success(data.message);
      navigate("/verify-email", { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "fullname", label: "Full Name", type: "text", placeholder: "John Doe", icon: UserIcon },
    { name: "email", label: "Email Address", type: "email", placeholder: "john@example.com", icon: MailIcon },
    { name: "phone", label: "Phone Number", type: "text", placeholder: "+1 234 567 8900", icon: PhoneIcon },
    { name: "password", label: "Password", type: showPassword ? "text" : "password", placeholder: "Min. 6 characters", icon: LockIcon, toggle: () => setShowPassword(!showPassword), showToggle: true, showState: showPassword },
    { name: "confirmPassword", label: "Confirm Password", type: showConfirm ? "text" : "password", placeholder: "Re-enter password", icon: ShieldIcon, toggle: () => setShowConfirm(!showConfirm), showToggle: true, showState: showConfirm },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        // * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          background: #0d0d0d;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        .floating-food {
          position: fixed;
          font-size: 2rem;
          pointer-events: none;
          z-index: 0;
          opacity: 0.12;
          animation: floatFood var(--dur) ease-in-out infinite var(--delay);
          filter: blur(0.5px);
        }

        @keyframes floatFood {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-18px) rotate(8deg); }
          66% { transform: translateY(10px) rotate(-5deg); }
        }

        .glow-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 0;
        }

        .orb-1 {
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%);
          top: -100px; right: -100px;
          animation: orbPulse 8s ease-in-out infinite;
        }

        .orb-2 {
          width: 350px; height: 350px;
          background: radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%);
          bottom: -50px; left: -50px;
          animation: orbPulse 10s ease-in-out infinite 3s;
        }

        @keyframes orbPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        .left-panel {
          flex: 1;
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 1024px) {
          .left-panel { display: flex; }
        }

        .food-showcase {
          width: 420px;
          height: 420px;
          position: relative;
          border-radius: 40% 60% 55% 45% / 45% 50% 50% 55%;
          overflow: hidden;
          border: 2px solid rgba(249,115,22,0.3);
          box-shadow: 0 0 60px rgba(249,115,22,0.15), inset 0 0 40px rgba(0,0,0,0.5);
        }

        .food-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.8s ease, transform 1s ease;
          transform: scale(1.05);
        }

        .food-img.active {
          opacity: 1;
          transform: scale(1);
        }

        .food-img.inactive {
          opacity: 0;
          transform: scale(1.1);
        }

        .food-dots {
          display: flex;
          gap: 8px;
          margin-top: 2rem;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(249,115,22,0.3);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .dot.active {
          background: #f97316;
          width: 24px;
          border-radius: 4px;
        }

        .brand-tagline {
          text-align: center;
          margin-top: 2.5rem;
        }

        .brand-name {
          font-family: 'Syne', sans-serif;
          font-size: 2.2rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
        }

        .brand-name span { color: #f97316; }

        .brand-sub {
          color: rgba(255,255,255,0.45);
          font-size: 0.95rem;
          margin-top: 0.5rem;
          font-weight: 300;
        }

        .stats-row {
          display: flex;
          gap: 2.5rem;
          margin-top: 2rem;
        }

        .stat-item { text-align: center; }

        .stat-num {
          font-family: 'Syne', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #f97316;
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
          margin-top: 2px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .right-panel {
          flex: 0 0 auto;
          width: 100%;
          max-width: 520px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 2rem 2.5rem;
          position: relative;
          z-index: 1;
        }

        @media (min-width: 1024px) {
          .right-panel {
            border-left: 1px solid rgba(255,255,255,0.06);
            padding: 3rem 3.5rem;
          }
        }

        .form-card {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .form-card.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .form-header { margin-bottom: 2.5rem; }

        .form-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(249,115,22,0.12);
          border: 1px solid rgba(249,115,22,0.25);
          color: #f97316;
          font-size: 0.75rem;
          font-weight: 500;
          padding: 5px 12px;
          border-radius: 20px;
          margin-bottom: 1.2rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .form-title {
          font-family: 'Syne', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        .form-title span { color: #f97316; }

        .form-subtitle {
          color: rgba(255,255,255,0.4);
          font-size: 0.9rem;
          margin-top: 0.6rem;
          font-weight: 300;
        }

        .fields-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .field-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(-20px);
          transition: opacity 0.4s ease, transform 0.4s ease;
        }

        .field-wrap.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .field-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.78rem;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .field-icon-wrap {
          width: 14px;
          height: 14px;
          color: rgba(249,115,22,0.7);
          flex-shrink: 0;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px 14px 16px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
        }

        .form-input::placeholder { color: rgba(255,255,255,0.2); }

        .form-input:focus {
          border-color: #f97316;
          background: rgba(249,115,22,0.05);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.1);
        }

        .eye-btn {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          display: flex;
          align-items: center;
          transition: color 0.2s;
          padding: 0;
        }

        .eye-btn:hover { color: #f97316; }

        .submit-btn {
          width: 100%;
          background: #f97316;
          border: none;
          border-radius: 12px;
          padding: 15px;
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          cursor: pointer;
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .submit-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
          pointer-events: none;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(249,115,22,0.4);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }

        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 1.2rem 0;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.08);
        }

        .divider-text {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.25);
        }

        .login-link {
          text-align: center;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.4);
        }

        .login-link a {
          color: #f97316;
          font-weight: 600;
          text-decoration: none;
          margin-left: 6px;
          transition: opacity 0.2s;
        }

        .login-link a:hover { opacity: 0.8; }

        .trust-badges {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.25);
        }

        .trust-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: rgba(249,115,22,0.5);
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      <div className="reg-root">
        {floatingIcons.map((item, i) => (
          <div
            key={i}
            className="floating-food"
            style={{ left: item.x, top: item.y, "--dur": item.duration, "--delay": item.delay }}
          >
            {item.icon}
          </div>
        ))}
        <div className="glow-orb orb-1" />
        <div className="glow-orb orb-2" />

        {/* Left Panel */}
        <div className="left-panel">
          <div className="food-showcase">
            {foodImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={`food-img ${i === activeImage ? "active" : "inactive"}`}
              />
            ))}
          </div>
          <div className="food-dots">
            {foodImages.map((_, i) => (
              <div key={i} className={`dot ${i === activeImage ? "active" : ""}`} onClick={() => setActiveImage(i)} />
            ))}
          </div>
          <div className="brand-tagline">
            <div className="brand-name">Feast<span>Run</span></div>
            <div className="brand-sub">Hot food. Fast delivery. Every time.</div>
          </div>
          <div className="stats-row">
            {[["50K+", "Happy Customers"], ["300+", "Restaurants"], ["25 min", "Avg Delivery"]].map(([n, l]) => (
              <div key={l} className="stat-item">
                <div className="stat-num">{n}</div>
                <div className="stat-label">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div className="right-panel">
          <div className={`form-card ${mounted ? "mounted" : ""}`}>
            <div className="form-header">
              <div className="form-badge">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="5"/></svg>
                New Member
              </div>
              <div className="form-title">
                Create your<br /><span>account</span>
              </div>
              <div className="form-subtitle">Join thousands ordering their favorite meals</div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="fields-grid">
                {fields.map((field, i) => (
                  <div
                    key={field.name}
                    className={`field-wrap ${mounted ? "mounted" : ""}`}
                    style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
                  >
                    <label className="field-label">
                      <span className="field-icon-wrap">
                        <field.icon size={14} />
                      </span>
                      {field.label}
                    </label>
                    <div className="input-wrap">
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        onFocus={() => setFocusedField(field.name)}
                        onBlur={() => setFocusedField(null)}
                        placeholder={field.placeholder}
                        className="form-input"
                        autoComplete="off"
                      />
                      {field.showToggle && (
                        <button type="button" className="eye-btn" onClick={field.toggle} tabIndex={-1}>
                          {field.showState ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><div className="btn-spinner" /> Creating Account…</>
                ) : (
                  <><RocketIcon size={18} /> Create My Account</>
                )}
              </button>
            </form>

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Already a member?</span>
              <div className="divider-line" />
            </div>

            <div className="login-link">
              <Link to="/login">Sign in to your account →</Link>
            </div>

            <div className="trust-badges">
              {["Secure & Encrypted", "No Spam", "Free to Join"].map((t) => (
                <div key={t} className="trust-item">
                  <div className="trust-dot" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function UserIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MailIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function PhoneIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function LockIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ShieldIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function EyeIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function RocketIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}