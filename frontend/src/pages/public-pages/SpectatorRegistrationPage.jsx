import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerSpectator } from "../../api/authApi";
import { setCredentials } from "../../store/slices/authSlice";

export default function SpectatorRegistrationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");

    if (name === "email") {
      setEmailAvailable(null);
    }
  };

  const checkEmailAvailability = async (email) => {
    try {
      // This is a simple check - you can implement a proper endpoint in backend
      setEmailAvailable(true);
    } catch (err) {
      setEmailAvailable(false);
    }
  };

  const handleEmailBlur = () => {
    if (formData.email) {
      checkEmailAvailability(formData.email);
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerSpectator(
        formData.name,
        formData.email,
        formData.password,
      );
      dispatch(setCredentials(response));
      navigate("/events");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return Math.min(strength, 4);
  };

  return (
    <div className="flex-1 bg-background-dark text-white">
      <header className="absolute top-0 z-50 w-full px-6 py-6 md:px-20">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between">
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
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-white/60 md:block">
              Already have an account?
            </span>
            <Link
              className="text-sm font-bold text-accent hover:underline"
              to="/login">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      <main className="relative flex flex-grow items-center justify-center px-6 pb-12 pt-24">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -left-[5%] -top-[10%] h-[40%] w-[40%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-[10%] -right-[5%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]" />
        </div>

        <div className="relative z-10 w-full max-w-xl">
          <div className="relative mb-12 flex items-center justify-between px-4">
            <div className="absolute left-0 top-1/2 z-0 h-[1px] w-full -translate-y-1/2 bg-white/10" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  step >= 1
                    ? "border-accent bg-accent text-charcoal"
                    : "border-white/10 bg-background-dark text-white/40"
                }`}>
                1
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  step >= 1 ? "text-accent" : "text-white/40"
                }`}>
                Personal
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                  step >= 2
                    ? "border-accent bg-accent text-charcoal"
                    : "border-white/10 bg-background-dark text-white/40"
                }`}>
                2
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  step >= 2 ? "text-accent" : "text-white/40"
                }`}>
                Security
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/10 bg-background-dark text-sm font-bold text-white/40">
                3
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                Preferences
              </span>
            </div>
          </div>

          <div
            className="rounded-3xl p-8 shadow-2xl md:p-12"
            style={{
              background: "rgba(28, 28, 28, 0.8)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(245, 192, 101, 0.1)",
            }}>
            <div className="mb-8">
              <h2 className="mb-2 text-3xl font-black">
                {step === 1
                  ? "Create Spectator Account"
                  : "Secure Your Account"}
              </h2>
              <p className="text-white/60">
                {step === 1
                  ? "Join the elite community of cinema enthusiasts."
                  : "Set a strong password to protect your account."}
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-red-500/20 p-3 text-sm text-red-300 border border-red-500/30">
                {error}
              </div>
            )}

            <form
              className="space-y-6"
              onSubmit={step === 2 ? handleSubmit : undefined}>
              {step === 1 ? (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="px-1 text-xs font-bold uppercase tracking-widest text-accent/80">
                      Full Name
                    </label>
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-accent">
                        person
                      </span>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-[#252525] py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="e.g. Julian Vane"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="px-1 text-xs font-bold uppercase tracking-widest text-accent/80">
                      Email Address
                    </label>
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-accent">
                        alternate_email
                      </span>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-[#252525] py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="julian@prestige.com"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleEmailBlur}
                      />
                      {emailAvailable === true && (
                        <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 text-emerald-500">
                          <span className="material-symbols-outlined text-sm">
                            check_circle
                          </span>
                          <span className="text-[10px] font-bold uppercase">
                            Available
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-2">
                    <label className="px-1 text-xs font-bold uppercase tracking-widest text-accent/80">
                      Password
                    </label>
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-accent">
                        lock
                      </span>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-[#252525] py-4 pl-12 pr-12 text-white placeholder:text-white/20 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="••••••••••••"
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}>
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-2 flex gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full ${
                              i < getPasswordStrength()
                                ? "bg-accent"
                                : "bg-white/10"
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-[10px] font-bold uppercase text-white/40">
                          {getPasswordStrength() === 0
                            ? "Weak"
                            : getPasswordStrength() === 1
                              ? "Fair"
                              : getPasswordStrength() === 2
                                ? "Good"
                                : getPasswordStrength() === 3
                                  ? "Strong"
                                  : "Very Strong"}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="px-1 text-xs font-bold uppercase tracking-widest text-accent/80">
                      Confirm Password
                    </label>
                    <div className="group relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-accent">
                        lock_check
                      </span>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-[#252525] py-4 pl-12 pr-12 text-white placeholder:text-white/20 outline-none transition-all focus:border-accent focus:ring-1 focus:ring-accent"
                        placeholder="••••••••••••"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }>
                        <span className="material-symbols-outlined text-xl">
                          {showConfirmPassword
                            ? "visibility_off"
                            : "visibility"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4">
                {step === 1 ? (
                  <button
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-black text-charcoal shadow-xl shadow-accent/10 transition-all hover:bg-accent/90 disabled:opacity-50"
                    type="button"
                    onClick={handleNextStep}
                    disabled={loading}>
                    Next Step
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                ) : (
                  <button
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-4 font-black text-charcoal shadow-xl shadow-accent/10 transition-all hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={loading}>
                    {loading ? "Creating Account..." : "Create Account"}
                    <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                )}
              </div>

              {step === 2 && (
                <button
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 font-bold text-white transition-all hover:bg-white/10"
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={loading}>
                  Back
                </button>
              )}

              <p className="px-4 text-center text-[11px] leading-relaxed text-white/40">
                By continuing, you agree to CinéEvent&apos;s{" "}
                <a className="text-white hover:underline" href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a className="text-white hover:underline" href="#">
                  Privacy Policy
                </a>{" "}
                regarding your spectator status.
              </p>
            </form>
          </div>

          <div className="mt-8 text-center">
            <a
              className="inline-flex items-center gap-2 text-sm font-medium text-white/40 transition-colors hover:text-accent"
              href="#">
              <span className="material-symbols-outlined text-lg">help</span>
              Need assistance with your registration?
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
