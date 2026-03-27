import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import heroImg from "../../images/upscalemedia-transformed.png";
import { loginWithEmail, loginWithGoogle } from "../../api/authApi";
import { setCredentials } from "../../store/slices/authSlice";
import { auth } from "../../config/firebase";

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await loginWithEmail(formData.email, formData.password);
      dispatch(setCredentials(response));
      navigate(response?.role === "admin" ? "/admin/dashboard" : "/events");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await loginWithGoogle(idToken);
      dispatch(setCredentials(response));
      navigate(response?.role === "admin" ? "/admin/dashboard" : "/events");
    } catch (err) {
      if (err.code === "auth/popup-blocked") {
        setError("Pop-up blocked. Please allow pop-ups for this site.");
      } else if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled.");
      } else if (err.code === "auth/unauthorized-domain") {
        setError(
          "This domain is not allowed in Firebase Auth. Add your frontend domain to Authorized domains in Firebase console.",
        );
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          "Google sign-in is not enabled in Firebase. Enable Google provider in Firebase Authentication settings.",
        );
      } else {
        setError(err.message || "Google sign-in failed. Please try again.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background-dark">
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImg})` }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, rgba(28, 28, 28, 0.4) 0%, rgba(28, 28, 28, 0.9) 100%)",
          }}
        />
      </div>

      <Link
        className="absolute left-6 top-6 z-20 inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-colors hover:text-white md:left-10 md:top-8"
        to="/">
        <span className="material-symbols-outlined text-lg">arrow_back</span>
        Return to Home Page
      </Link>

      <main className="relative z-10 w-full max-w-[480px] px-6 py-12">
        <div
          className="rounded-xl p-8 shadow-2xl transition-all md:p-12"
          style={{
            background: "rgba(28, 28, 28, 0.85)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(245, 192, 101, 0.15)",
          }}>
          <div className="mb-10 flex flex-col items-center">
            <div className="mb-4 text-accent">
              <span className="material-symbols-outlined text-5xl">
                movie_filter
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-white">
              CINÉ<span className="text-accent">EVENT</span>
            </h1>
            <p className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-white/50">
              Secure Access Portal
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-red-500/20 p-3 text-sm text-red-300 border border-red-500/30">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="ml-1 text-xs font-bold uppercase tracking-widest text-accent"
                htmlFor="email">
                Email Address
              </label>
              <div className="group relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-accent">
                  mail
                </span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/50"
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <label
                  className="text-xs font-bold uppercase tracking-widest text-accent"
                  htmlFor="password">
                  Password
                </label>
                <Link
                  className="text-xs text-white/40 transition-colors hover:text-accent"
                  to="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <div className="group relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-accent">
                  lock
                </span>
                <input
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/50"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                  <span className="material-symbols-outlined">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              type="submit"
              disabled={loading}>
              {loading ? "Signing in..." : "Enter Cinema"}
              <span className="material-symbols-outlined text-xl">
                arrow_right_alt
              </span>
            </button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-white/10" />
              <span className="mx-4 flex-shrink text-xs font-bold uppercase tracking-widest text-white/20">
                Or continue with
              </span>
              <div className="flex-grow border-t border-white/10" />
            </div>

            <button
              className="group flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/5 py-3.5 font-bold text-white transition-all hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
              disabled={loading || googleLoading}
              onClick={handleGoogleLogin}>
              <svg
                className="h-5 w-5 transition-transform group-hover:scale-110"
                viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-white/40">
              Don&apos;t have an account yet?
              <Link
                className="ml-1 font-bold text-accent hover:underline"
                to="/signup">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      <div className="pointer-events-none absolute bottom-12 right-12 hidden select-none text-accent/20 lg:block">
        <span className="material-symbols-outlined text-9xl">
          confirmation_number
        </span>
      </div>
      <div className="pointer-events-none absolute left-12 top-12 hidden select-none text-accent/20 lg:block">
        <span className="material-symbols-outlined text-9xl">theaters</span>
      </div>
    </div>
  );
}
