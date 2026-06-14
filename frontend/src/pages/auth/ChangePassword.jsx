import { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { changePassword } from "../../services/authService";

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = [
  "bg-red-500",
  "bg-red-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-emerald-400",
];

function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const strength = getStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast.error("All fields are required");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      const { data } = await changePassword({
        currentPassword,
        newPassword,
      });

      toast.success(data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to change password"
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
        <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-purple-500/20 rounded-full blur-[120px]" />
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
          <ShieldCheck className="w-6 h-6 text-orange-300" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">
          Change password
        </h1>
        <p className="mt-2 text-sm text-white/50 leading-relaxed">
          Update your password to keep your account secure. You'll need your
          current password to confirm this change.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Current password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">
              Current password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-11 text-white placeholder:text-white/30 outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                aria-label={showCurrent ? "Hide password" : "Show password"}
              >
                {showCurrent ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
          </div>

          {/* New password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">
              New password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 pl-11 pr-11 text-white placeholder:text-white/30 outline-none focus:border-orange-400/50 focus:bg-white/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                aria-label={showNew ? "Hide password" : "Show password"}
              >
                {showNew ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>

            {/* Strength meter */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < strength
                          ? STRENGTH_COLORS[strength]
                          : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-white/40">
                  {STRENGTH_LABELS[strength]}
                </p>
              </div>
            )}
          </div>

          {/* Confirm password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-white/70">
              Confirm new password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/40" />
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className={`w-full bg-white/5 border rounded-xl py-3.5 pl-11 pr-11 text-white placeholder:text-white/30 outline-none focus:bg-white/10 transition-all duration-200 ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-red-400/50 focus:border-red-400/60"
                    : "border-white/10 focus:border-orange-400/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? (
                  <EyeOff className="w-4.5 h-4.5" />
                ) : (
                  <Eye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="mt-1.5 text-xs text-red-400">
                Passwords do not match
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
                Updating...
              </>
            ) : (
              <>
                Change password
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
