import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyEmailOtp, resendOtp } from "../../services/authService";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(["","","","","",""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => { setTimeout(() => setMounted(true), 80); }, []);

  const handleOtpChange = (val, i) => {
    const n = [...otp]; n[i] = val.slice(-1); setOtp(n);
    setProgress(n.filter(v=>v!=="").length / 6 * 100);
    if (val && i < 5) inputRefs.current[i+1]?.focus();
  };

  const handleOtpKey = (e, i) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) inputRefs.current[i-1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    const otpStr = otp.join("");
    if (otpStr.length < 6) return toast.error("Enter the 6-digit code");
    try {
      setLoading(true);
      const { data } = await verifyEmailOtp({ email, otp: otpStr });
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Please enter email");
    try {
      setResendLoading(true);
      const { data } = await resendOtp({ email });
      toast.success(data.message);
      setOtp(["","","","","",""]);
      setProgress(0);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally { setResendLoading(false); }
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
        .auth-title{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;color:#fff;line-height:1.1;letter-spacing:-.03em;text-align:center;}
        .auth-title span{color:#f97316;}
        .auth-sub{color:rgba(255,255,255,.38);font-size:.83rem;margin-top:.45rem;font-weight:300;text-align:center;margin-bottom:1.4rem;}
        .auth-shimmer{height:2px;background:linear-gradient(90deg,transparent,rgba(249,115,22,.55),transparent);background-size:200% 100%;animation:authSh 2.5s infinite;border-radius:2px;margin:1rem 0;}
        @keyframes authSh{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .auth-label{display:flex;align-items:center;gap:6px;font-size:.7rem;font-weight:500;color:rgba(255,255,255,.42);text-transform:uppercase;letter-spacing:.07em;margin-bottom:5px;}
        .auth-label svg{color:rgba(249,115,22,.7);}
        .auth-input{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:11px;padding:12px 15px;color:#fff;font-family:'DM Sans',sans-serif;font-size:.9rem;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;margin-bottom:.9rem;}
        .auth-input::placeholder{color:rgba(255,255,255,.2);}
        .auth-input:focus{border-color:#f97316;background:rgba(249,115,22,.05);box-shadow:0 0 0 3px rgba(249,115,22,.1);}
        .auth-fw{margin-bottom:.9rem;}
        .auth-pbtn{width:100%;background:#f97316;border:none;border-radius:11px;padding:13px;color:#fff;font-family:'Syne',sans-serif;font-size:.9rem;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;position:relative;overflow:hidden;transition:transform .2s,box-shadow .2s;letter-spacing:.02em;margin-top:.5rem;}
        .auth-pbtn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 55%);pointer-events:none;}
        .auth-pbtn:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 28px rgba(249,115,22,.42);}
        .auth-pbtn:disabled{opacity:.65;cursor:not-allowed;}
        .auth-obtn{width:100%;background:transparent;border:1px solid rgba(249,115,22,.4);border-radius:11px;padding:12px;color:#f97316;font-family:'Syne',sans-serif;font-size:.85rem;font-weight:700;cursor:pointer;transition:all .2s;margin-top:.65rem;}
        .auth-obtn:hover:not(:disabled){background:rgba(249,115,22,.08);}
        .auth-obtn:disabled{opacity:.45;cursor:not-allowed;}
        .auth-spin{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:authSpin .7s linear infinite;flex-shrink:0;}
        @keyframes authSpin{to{transform:rotate(360deg)}}
        .auth-div{display:flex;align-items:center;gap:10px;margin:.9rem 0;}
        .auth-dl{flex:1;height:1px;background:rgba(255,255,255,.07);}
        .auth-dt{font-size:.7rem;color:rgba(255,255,255,.22);}
        .auth-btm{text-align:center;font-size:.82rem;color:rgba(255,255,255,.32);}
        .auth-btm a{color:#f97316;font-weight:600;text-decoration:none;margin-left:4px;}
        .otp-row{display:flex;gap:10px;justify-content:center;margin:.5rem 0 .3rem;}
        .otp-cell{width:52px;height:56px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:11px;font-size:1.4rem;font-weight:700;color:#fff;font-family:'Syne',sans-serif;text-align:center;outline:none;transition:border-color .2s,background .2s,box-shadow .2s;caret-color:#f97316;}
        .otp-cell:focus{border-color:#f97316;background:rgba(249,115,22,.06);box-shadow:0 0 0 3px rgba(249,115,22,.12);}
        .otp-cell.filled{border-color:rgba(249,115,22,.45);}
        .prog-bar{height:3px;background:rgba(255,255,255,.06);border-radius:2px;overflow:hidden;margin:.5rem 0;}
        .prog-fill{height:100%;background:#f97316;border-radius:2px;transition:width .3s ease;}
        .mail-icon-wrap{width:56px;height:56px;border-radius:50%;background:rgba(249,115,22,.1);display:flex;align-items:center;justify-content:center;margin:0 auto .9rem;position:relative;}
        .mail-ring{position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(249,115,22,.25);animation:mring 2s ease-in-out infinite;}
        @keyframes mring{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.08);opacity:1}}
      `}</style>

      <div className="auth-root">
        <div className="auth-orb auth-orb1"/>
        <div className="auth-orb auth-orb2"/>
        {[{i:"🍕",x:"7%",y:"13%",d:"6s",dl:"0s"},{i:"🍔",x:"84%",y:"9%",d:"7.5s",dl:"1s"},{i:"🌮",x:"4%",y:"67%",d:"5.5s",dl:"2s"},{i:"🥗",x:"88%",y:"61%",d:"8s",dl:".5s"}].map((f,i)=>(
          <div key={i} className="auth-floater" style={{left:f.x,top:f.y,"--dur":f.d,"--delay":f.dl}}>{f.i}</div>
        ))}

        <div className={`auth-card ${mounted?"in":""}`}>
          <div className="auth-badge" style={{display:"flex",justifyContent:"center",width:"fit-content",margin:"0 auto 1rem"}}>
            <div className="auth-pdot"/>Almost There
          </div>

          <div className="mail-icon-wrap">
            <div className="mail-ring"/>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
          </div>

          <div className="auth-title">Verify your<br/><span>email</span></div>
          <div className="auth-sub">We sent a verification code to your inbox</div>
          <div className="auth-shimmer"/>

          <form onSubmit={handleVerify}>
            <div className="auth-fw">
              <div className="auth-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                Email Address
              </div>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="auth-input"/>
            </div>

            <div className="auth-fw">
              <div className="auth-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                Verification Code
              </div>
              <div className="prog-bar"><div className="prog-fill" style={{width:`${progress}%`}}/></div>
              <div className="otp-row">
                {otp.map((val,i)=>(
                  <input key={i} ref={el=>inputRefs.current[i]=el} type="text" inputMode="numeric" maxLength={1} value={val} onChange={e=>handleOtpChange(e.target.value,i)} onKeyDown={e=>handleOtpKey(e,i)} className={`otp-cell ${val?"filled":""}`}/>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-pbtn">
              {loading ? <><div className="auth-spin"/>Verifying…</> : <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Verify Email
              </>}
            </button>
          </form>

          <button disabled={resendLoading} onClick={handleResend} className="auth-obtn">
            {resendLoading ? <><div className="auth-spin" style={{display:"inline-block",marginRight:"6px",verticalAlign:"middle"}}/>Sending…</> : <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:"6px",verticalAlign:"-2px"}}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-.73-7.6"/></svg>
              Resend Verification Code
            </>}
          </button>

          <div className="auth-div"><div className="auth-dl"/><span className="auth-dt">Already verified?</span><div className="auth-dl"/></div>
          <div className="auth-btm">Go to<Link to="/login">Login →</Link></div>
        </div>
      </div>
    </>
  );
}