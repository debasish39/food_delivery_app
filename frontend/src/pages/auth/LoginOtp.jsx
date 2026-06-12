import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { sendLoginOtp, verifyLoginOtp } from "../../services/authService";

export default function LoginOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRefs = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const startCountdown = () => {
    setCountdown(30); setCanResend(false);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown(p => { if (p <= 1) { clearInterval(timerRef.current); setCanResend(true); return 0; } return p - 1; });
    }, 1000);
  };

  const handleSendOtp = async () => {
    if (!email) return toast.error("Please enter email");
    try {
      setLoading(true);
      const { data } = await sendLoginOtp({ email });
      toast.success(data.message);
      setOtpSent(true);
      startCountdown();
      setTimeout(() => inputRefs.current[0]?.focus(), 200);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) return toast.error("Enter all 6 digits");
    try {
      setLoading(true);
      const { data } = await verifyLoginOtp({ email, otp: otpStr });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success("Login Successful");
      window.location.href = "/";
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP Verification Failed");
    } finally { setLoading(false); }
  };

  const handleOtpChange = (val, i) => {
    const newOtp = [...otp];
    newOtp[i] = val.slice(-1);
    setOtp(newOtp);
    setProgress(newOtp.filter(v=>v!=="").length / 6 * 100);
    if (val && i < 5) inputRefs.current[i+1]?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i-1]?.focus();
  };

  const sharedStyles = `
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
    .auth-label{display:flex;align-items:center;gap:6px;font-size:.7rem;font-weight:500;color:rgba(255,255,255,.42);text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;}
    .auth-label svg{color:rgba(249,115,22,.7);}
    .auth-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:11px;padding:12px 15px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;margin-bottom:.9rem;}
    .auth-input::placeholder{color:rgba(255,255,255,.2);}
    .auth-input:focus{border-color:#f97316;background:rgba(249,115,22,.05);box-shadow:0 0 0 3px rgba(249,115,22,.1);}
    .auth-pbtn{width:100%;background:#f97316;border:none;border-radius:11px;padding:13px;color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;letter-spacing:.02em;}
    .auth-pbtn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 55%);pointer-events:none;}
    .auth-pbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.42);}
    .auth-pbtn:disabled{opacity:.65;cursor:not-allowed;}
    .auth-obtn{width:100%;background:transparent;border:1px solid rgba(249,115,22,.4);border-radius:11px;padding:12px;color:#f97316;font-family:'Syne',sans-serif;font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;margin-top:.65rem;}
    .auth-obtn:hover:not(:disabled){background:rgba(249,115,22,.08);}
    .auth-obtn:disabled{opacity:.4;cursor:not-allowed;}
    .auth-spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:authSpin .7s linear infinite;flex-shrink:0;}
    @keyframes authSpin{to{transform:rotate(360deg)}}
    .auth-div{display:flex;align-items:center;gap:10px;margin:.9rem 0;}
    .auth-dl{flex:1;height:1px;background:rgba(255,255,255,.07);}
    .auth-dt{font-size:.7rem;color:rgba(255,255,255,.22);}
    .auth-btm{text-align:center;font-size:.82rem;color:rgba(255,255,255,.32);}
    .auth-btm a{color:#f97316;font-weight:600;text-decoration:none;margin-left:4px;}
    .otp-row{display:flex;gap:10px;justify-content:center;margin:.9rem 0;}
    .otp-cell{width:52px;height:56px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:11px;font-size:1.4rem;font-weight:700;color:#fff;font-family:'Syne',sans-serif;text-align:center;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;caret-color:#f97316;}
    .otp-cell:focus{border-color:#f97316;background:rgba(249,115,22,.06);box-shadow:0 0 0 3px rgba(249,115,22,.12);}
    .otp-cell.filled{border-color:rgba(249,115,22,.45);}
    .prog-bar{height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin:.7rem 0;}
    .prog-fill{height:100%;background:#f97316;border-radius:2px;transition:width .3s ease;}
    .email-chip{display:inline-flex;align-items:center;gap:6px;background:rgba(249,115,22,.08);border:1px solid rgba(249,115,22,.18);color:rgba(255,255,255,.65);font-size:.78rem;padding:5px 12px;border-radius:20px;margin-bottom:.9rem;}
    .cdown{font-size:.75rem;color:rgba(255,255,255,.28);text-align:center;margin-top:.45rem;}
    .cdown span{color:#f97316;font-weight:600;}
  `;

  return (
    <>
      <style>{sharedStyles}</style>
      <div className="auth-root">
        <div className="auth-orb auth-orb1"/>
        <div className="auth-orb auth-orb2"/>
        {[{i:"🍕",x:"7%",y:"13%",d:"6s",dl:"0s"},{i:"🍔",x:"84%",y:"9%",d:"7.5s",dl:"1s"},{i:"🌮",x:"4%",y:"67%",d:"5.5s",dl:"2s"},{i:"🍜",x:"88%",y:"61%",d:"8s",dl:".5s"}].map((f,i)=>(
          <div key={i} className="auth-floater" style={{left:f.x,top:f.y,"--dur":f.d,"--delay":f.dl}}>{f.i}</div>
        ))}

        <div className={`auth-card ${mounted?"in":""}`}>
          {!otpSent ? (
            <>
              <div className="auth-badge"><div className="auth-pdot"/>Passwordless</div>
              <div className="auth-title">Login with<br/><span>OTP</span></div>
              <div className="auth-sub">We'll send a one-time code to your inbox</div>
              <div className="auth-shimmer"/>
              <div className="auth-label" style={{marginBottom:"5px"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Your Email
              </div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="auth-input"/>
              <button onClick={handleSendOtp} disabled={loading} className="auth-pbtn">
                {loading ? <><div className="auth-spin"/>Sending…</> : <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Send OTP Code
                </>}
              </button>
            </>
          ) : (
            <>
              <div className="auth-badge"><div className="auth-pdot"/>Check Inbox</div>
              <div className="auth-title">Enter<br/><span>your code</span></div>
              <div className="auth-sub">6-digit OTP sent to your email</div>
              <div className="email-chip" style={{marginTop:"1rem"}}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                {email}
              </div>
              <div className="prog-bar"><div className="prog-fill" style={{width:`${progress}%`}}/></div>
              <form onSubmit={handleVerifyOtp}>
                <div className="otp-row">
                  {otp.map((val, i) => (
                    <input key={i} ref={el=>inputRefs.current[i]=el} type="text" inputMode="numeric" maxLength={1} value={val} onChange={e=>handleOtpChange(e.target.value,i)} onKeyDown={e=>handleOtpKey(e,i)} className={`otp-cell ${val?"filled":""}`}/>
                  ))}
                </div>
                <div className="cdown">{canResend ? "Ready to resend" : <>Resend in <span>{countdown}s</span></>}</div>
                <button type="submit" disabled={loading} className="auth-pbtn" style={{marginTop:".9rem"}}>
                  {loading ? <><div className="auth-spin"/>Verifying…</> : <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Verify & Login
                  </>}
                </button>
                <button type="button" disabled={!canResend} className="auth-obtn" onClick={handleSendOtp}>Resend OTP</button>
              </form>
            </>
          )}

          <div className="auth-div"><div className="auth-dl"/><span className="auth-dt">Or use password</span><div className="auth-dl"/></div>
          <div className="auth-btm">Prefer password?<Link to="/login">Login here</Link></div>
        </div>
      </div>
    </>
  );
}