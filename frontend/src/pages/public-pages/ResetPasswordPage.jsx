import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  resetPasswordWithToken,
  validatePasswordResetToken,
} from "../../api/authApi";

const getStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        setError("Reset link is invalid.");
        setChecking(false);
        return;
      }

      try {
        await validatePasswordResetToken(token);
      } catch (err) {
        setError(err.message || "Reset link is invalid or expired.");
      } finally {
        setChecking(false);
      }
    };

    checkToken();
  }, [token]);

  const strength = useMemo(() => getStrength(password), [password]);
  const strengthLabel = ["Weak", "Fair", "Good", "Strong"][
    Math.max(strength - 1, 0)
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPasswordWithToken(token, password);
      setSuccess("Password reset successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-dark text-white min-h-screen flex flex-col transition-colors duration-300">
      <header className="w-full border-b border-white/10 bg-background-dark/95 backdrop-blur-md px-6 md:px-20 py-6">
        <div className="max-w-[1440px] mx-auto flex items-center justify-center md:justify-start">
          <div className="flex items-center gap-3">
            <div className="text-accent">
              <span className="material-symbols-outlined text-4xl">
                movie_filter
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-white">
              CINÉ<span className="text-accent">EVENT</span>
            </h1>
          </div>
        </div>
      </header>

      <main className="flex-grow relative flex items-center justify-center py-20 px-6">
        <div className="absolute inset-0 z-0 opacity-40">
          <div
            className="w-full h-full bg-cover bg-center grayscale contrast-125"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAd3A7zN8XJfsAmrKXjtwlM9MqEN5uss5iTplmQI0HLe3sn20Z2Y-s-b_3I-BUBIblpMjueS4OWDZ5sbMW1QjifoSBpgBjXIdFHtdFoxUXW-xjKi-jVg7bc5tExRxa0xf5zMMrOIySNkMyAwcdsztH28NdosuORMXzAmzwiM5Wl9RML5zQCy4nAH9Z-G6736Lo9EBndo62XX4wWMlKP0kQGHF4OBqmIL-kFbTYFlPN_0ROCtqXjUTIqaHfNI9Qzs0s6LCMPIyZsCHXB')",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at center, rgba(128, 0, 32, 0.15) 0%, rgba(28, 28, 28, 1) 100%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[480px]">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 border border-primary/30 mb-6 text-accent">
                <span className="material-symbols-outlined text-3xl">
                  lock_reset
                </span>
              </div>
              <h2 className="text-3xl font-black text-white mb-3">
                Set New Password
              </h2>
              <p className="text-white/60 text-sm">
                Please enter a strong password to ensure your account remains
                secure.
              </p>
            </div>

            {checking && (
              <div className="mb-6 rounded-lg border border-white/20 bg-white/10 p-3 text-sm text-white/80">
                Verifying reset link...
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">
                {success}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-accent/80 ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors">
                    key
                  </span>
                  <input
                    className="w-full bg-charcoal/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                    placeholder="••••••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={
                      checking || loading || Boolean(success) || Boolean(error)
                    }
                    required
                  />
                </div>
                <div className="pt-2 px-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                      Password Strength
                    </span>
                    <span className="text-[10px] font-bold text-accent uppercase">
                      {password ? strengthLabel : "-"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 rounded-full transition-all ${
                          strength >= level ? "bg-accent" : "bg-white/20"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-white/40 mt-3 leading-relaxed">
                    Use 8+ characters with a mix of letters, numbers and
                    symbols.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-accent/80 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-accent transition-colors">
                    verified_user
                  </span>
                  <input
                    className="w-full bg-charcoal/60 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none transition-all"
                    placeholder="••••••••••••"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={
                      checking || loading || Boolean(success) || Boolean(error)
                    }
                    required
                  />
                </div>
              </div>

              <button
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-lg shadow-primary/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={
                  checking || loading || Boolean(success) || Boolean(error)
                }>
                {loading ? "Resetting..." : "Reset Password"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>

            <div className="mt-10 text-center">
              <Link
                className="text-sm text-white/40 hover:text-accent transition-colors flex items-center justify-center gap-2"
                to="/login">
                <span className="material-symbols-outlined text-sm">
                  arrow_back
                </span>
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-charcoal/50 backdrop-blur-md text-white/40 py-8 border-t border-white/5 text-center">
        <div className="max-w-[1440px] mx-auto px-6">
          <p className="text-xs">
            © 2024 CinéEvent International. Secure password reset gateway.
          </p>
        </div>
      </footer>
    </div>
  );
}
