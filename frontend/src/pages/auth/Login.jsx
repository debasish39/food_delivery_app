import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUser } from "../../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error("Please fill all fields");
    try {
      setLoading(true);
      const { data } = await loginUser({ email: formData.email, password: formData.password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login Successful");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500&display=swap');
        .auth-root{min-height:100vh;background:#0d0d0d;display:flex;align-items:center;justify-content:center;padding:1.5rem;font-family:'DM Sans',sans-serif;position:relative;overflow:hidden;}
        .auth-orb{position:fixed;border-radius:50%;pointer-events:none;z-index:0;}
        .auth-orb1{width:480px;height:480px;background:radial-gradient(circle,rgba(249,115,22,.17) 0%,transparent 70%);top:-100px;right:-80px;animation:authOrb 8s ease-in-out infinite;}
        .auth-orb2{width:320px;height:320px;background:radial-gradient(circle,rgba(249,115,22,.1) 0%,transparent 70%);bottom:-60px;left:-60px;animation:authOrb 11s ease-in-out infinite 3s;}
        @keyframes authOrb{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.15);opacity:1}}
        .auth-floater{position:fixed;font-size:1.8rem;pointer-events:none;z-index:0;opacity:.09;animation:authFloat var(--dur) ease-in-out infinite var(--delay);}
        @keyframes authFloat{0%,100%{transform:translateY(0) rotate(0deg)}33%{transform:translateY(-16px) rotate(7deg)}66%{transform:translateY(9px) rotate(-5deg)}}
        .auth-card{width:100%;max-width:420px;position:relative;z-index:1;opacity:0;transform:translateY(26px);transition:opacity .55s ease,transform .55s ease;}
        .auth-card.in{opacity:1;transform:none;}
        .auth-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.22);color:#f97316;font-size:.69rem;font-weight:500;padding:5px 12px;border-radius:20px;text-transform:uppercase;letter-spacing:.07em;margin-bottom:1rem;}
        .auth-pdot{width:6px;height:6px;border-radius:50%;background:#f97316;animation:authPd 1.5s ease-in-out infinite;}
        @keyframes authPd{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.65)}}
        .auth-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;line-height:1.1;letter-spacing:-.03em;}
        .auth-title span{color:#f97316;}
        .auth-sub{color:rgba(255,255,255,.38);font-size:.83rem;margin-top:.45rem;font-weight:300;}
        .auth-shimmer{height:2px;background:linear-gradient(90deg,transparent,rgba(249,115,22,.55),transparent);background-size:200% 100%;animation:authSh 2.5s infinite;border-radius:2px;margin:1.2rem 0;}
        @keyframes authSh{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .auth-fw{opacity:0;transform:translateX(-16px);transition:opacity .35s ease,transform .35s ease;margin-bottom:.9rem;}
        .auth-fw.in{opacity:1;transform:none;}
        .auth-label{display:flex;align-items:center;gap:6px;font-size:.7rem;font-weight:500;color:rgba(255,255,255,.42);text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;}
        .auth-label svg{color:rgba(249,115,22,.7);}
        .auth-iw{position:relative;display:flex;align-items:center;}
        .auth-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:11px;padding:12px 15px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;}
        .auth-input::placeholder{color:rgba(255,255,255,.2);}
        .auth-input:focus{border-color:#f97316;background:rgba(249,115,22,.05);box-shadow:0 0 0 3px rgba(249,115,22,.1);}
        .auth-eye{position:absolute;right:13px;background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);display:flex;align-items:center;padding:0;transition:color .2s;}
        .auth-eye:hover{color:#f97316;}
        .auth-remember{display:flex;align-items:center;justify-content:space-between;margin-bottom:.9rem;}
        .auth-rem{display:flex;align-items:center;gap:7px;font-size:.8rem;color:rgba(255,255,255,.38);cursor:pointer;}
        .auth-cbx{width:16px;height:16px;border:1px solid rgba(255,255,255,.2);border-radius:4px;background:transparent;appearance:none;cursor:pointer;transition:all .2s;flex-shrink:0;accent-color:#f97316;}
        .auth-cbx:checked{background:#f97316;border-color:#f97316;}
        .auth-forg{font-size:.78rem;color:#f97316;font-weight:500;text-decoration:none;}
        .auth-pbtn{width:100%;background:#f97316;border:none;border-radius:11px;padding:13px;color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;letter-spacing:.02em;}
        .auth-pbtn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 55%);pointer-events:none;}
        .auth-pbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.42);}
        .auth-pbtn:disabled{opacity:.65;cursor:not-allowed;}
        .auth-obtn{width:100%;background:transparent;border:1px solid rgba(249,115,22,.45);border-radius:11px;padding:12px;color:#f97316;font-family:'Syne',sans-serif;font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;margin-top:.65rem;}
        .auth-obtn:hover{background:rgba(249,115,22,.08);}
        .auth-spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:authSpin .7s linear infinite;flex-shrink:0;}
        @keyframes authSpin{to{transform:rotate(360deg)}}
        .auth-div{display:flex;align-items:center;gap:10px;margin:.9rem 0;}
        .auth-dl{flex:1;height:1px;background:rgba(255,255,255,.07);}
        .auth-dt{font-size:.7rem;color:rgba(255,255,255,.22);}
        .auth-btm{text-align:center;font-size:.82rem;color:rgba(255,255,255,.32);}
        .auth-btm a{color:#f97316;font-weight:600;text-decoration:none;margin-left:4px;}
        .auth-trusts{display:flex;justify-content:center;flex-wrap:wrap;gap:1rem;margin-top:1.1rem;}
        .auth-ti{display:flex;align-items:center;gap:5px;font-size:.67rem;color:rgba(255,255,255,.2);}
        .auth-tdot{width:4px;height:4px;border-radius:50%;background:rgba(249,115,22,.5);}
      `}</style>

      <div className="auth-root mt-6">
        <div className="auth-orb auth-orb1" />
        <div className="auth-orb auth-orb2" />
        {[
          { i:"🍕",x:"7%",y:"13%",d:"6s",dl:"0s"},{i:"🍔",x:"84%",y:"9%",d:"7.5s",dl:"1s"},
          {i:"🌮",x:"4%",y:"67%",d:"5.5s",dl:"2s"},{i:"🍜",x:"88%",y:"61%",d:"8s",dl:".5s"},
        ].map((f,i)=>(
          <div key={i} className="auth-floater" style={{left:f.x,top:f.y,"--dur":f.d,"--delay":f.dl}}>{f.i}</div>
        ))}

        <div className={`auth-card ${mounted?"in":""}`}>
          <div className="auth-badge"><div className="auth-pdot"/>Welcome Back</div>
          <div className="auth-title">Sign in to<br/><span>FeastRun</span></div>
          <div className="auth-sub">Your favorite food, delivered fast</div>
          <div className="auth-shimmer"/>

          <form onSubmit={handleSubmit}>
            <div className={`auth-fw ${mounted?"in":""}`} style={{transitionDelay:".08s"}}>
              <div className="auth-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email Address
              </div>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="auth-input"/>
            </div>

            <div className={`auth-fw ${mounted?"in":""}`} style={{transitionDelay:".16s"}}>
              <div className="auth-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Password
              </div>
              <div className="auth-iw">
                <input type={showPwd?"text":"password"} name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" className="auth-input"/>
                <button type="button" className="auth-eye" onClick={()=>setShowPwd(!showPwd)}>
                  {showPwd
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <div className={`auth-remember auth-fw ${mounted?"in":""}`} style={{transitionDelay:".22s"}}>
              <label className="auth-rem"><input type="checkbox" className="auth-cbx"/> Remember me</label>
              <Link to="/forgot-password" className="auth-forg">Forgot Password?</Link>
            </div>

            <div className={`auth-fw ${mounted?"in":""}`} style={{transitionDelay:".28s"}}>
              <button type="submit" disabled={loading} className="auth-pbtn">
                {loading ? <><div className="auth-spin"/> Logging in…</> : <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Login to Account
                </>}
              </button>
              <Link to="/login-otp">
                <button type="button" className="auth-obtn">Login With OTP Instead</button>
              </Link>
            </div>
          </form>

          <div className="auth-div"><div className="auth-dl"/><span className="auth-dt">New here?</span><div className="auth-dl"/></div>
          <div className="auth-btm">Don't have an account?<Link to="/register">Register for free</Link></div>
          <div className="auth-trusts">
            {["256-bit SSL","No Spam","Cancel Anytime"].map(t=>(
              <div key={t} className="auth-ti"><div className="auth-tdot"/>{t}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

