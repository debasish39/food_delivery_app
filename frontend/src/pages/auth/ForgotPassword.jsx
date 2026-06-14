import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { Mail, ArrowLeft, ArrowRight, KeyRound, Loader2 } from "lucide-react";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = {};

  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (
    !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)
  ) {
    newErrors.email = "Please enter a valid email";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setErrors({});

  try {
    setLoading(true);

    const { data } = await forgotPassword({ email });

    toast.success(data.message);
    localStorage.setItem("resetEmail", email);
    navigate("/reset-password");
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Failed to send OTP"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0a13] text-white px-4 relative overflow-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1030] via-[#0b0a13] to-[#160e08]" />
        <div className="absolute -top-32 -left-32 w-[28rem] h-[28rem] bg-orange-500/25 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-pink-500/20 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/40">
        <div className="w-14 h-14 rounded-2xl bg-orange-400/15 border border-orange-300/20 flex items-center justify-center mb-6">
          <KeyRound className="w-6 h-6 text-orange-300" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm text-white/50 leading-relaxed">
          No worries — enter the email associated with your account and
          we'll send you a one-time code to reset it.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">
              Email address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
             <input
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  }}
  placeholder="you@example.com"
  className={`w-full bg-white/5 rounded-xl py-3.5 pl-11 pr-4 text-white placeholder:text-white/30 outline-none transition-all duration-200 border
    ${
      errors.email
        ? "border-red-500 ring-2 ring-red-500/20"
        : "border-white/10 focus:border-orange-400/50 focus:bg-white/10"
    }`}
/>
            </div>
            {errors.email && (
  <p className="mt-2 text-sm text-red-500">
    {errors.email}
  </p>
)}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-orange-900/40 hover:shadow-orange-700/50 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-orange-900/40"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}