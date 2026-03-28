import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerOrganizer } from "../../api/authApi";
import { setCredentials } from "../../store/slices/authSlice";

export default function OrganizerRegistrationPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationName: "",
    website: "",
    shortBio: "",
    iban: "",
    legalDocumentName: "",
    termsAccepted: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleFileChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files).slice(0, 3) : [];
    if (files.length > 0) {
      setSelectedFiles(files);
      setFormData((prev) => ({
        ...prev,
        legalDocumentName: files.map((f) => f.name).join(", "),
      }));
      setError("");
    }
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError("Representative full name is required");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Please provide a valid email address");
      return false;
    }
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!formData.organizationName.trim()) {
      setError("Organization name is required");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.iban.trim()) {
      setError("IBAN is required for payouts");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (selectedFiles.length === 0) {
      setError("Please upload your legal documents");
      return false;
    }
    if (selectedFiles.length > 3) {
      setError("You can upload a maximum of 3 documents");
      return false;
    }
    if (!formData.termsAccepted) {
      setError("You must accept the organizer terms to continue");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && !validateStep1()) {
      return;
    }
    if (step === 2 && !validateStep2()) {
      return;
    }
    setError("");
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePreviousStep = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerOrganizer({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        organizationName: formData.organizationName,
        website: formData.website,
        shortBio: formData.shortBio,
        iban: formData.iban,
        legalDocumentName: formData.legalDocumentName,
        legalDocuments: selectedFiles,
      });

      dispatch(setCredentials(response));
      navigate("/organizer-pending-validation", { replace: true });
    } catch (err) {
      setError(err.message || "Organizer registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      "organizer_registration_draft",
      JSON.stringify({
        ...formData,
        password: "",
        confirmPassword: "",
      }),
    );
  };

  return (
    <div className="flex-1 bg-background-dark text-white">
      <main className="flex flex-1 flex-col items-center px-6 py-12 md:py-16">
        <div className="w-full max-w-4xl">
          <div className="relative mb-12 flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -z-10 h-px w-full -translate-y-1/2 bg-white/10" />
            <div className="flex flex-col items-center gap-3 bg-background-dark px-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold ${
                  step >= 1
                    ? "border-accent bg-accent text-charcoal"
                    : "border-white/20 bg-background-dark text-white/40"
                }`}>
                1
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  step >= 1 ? "text-accent" : "text-white/40"
                }`}>
                Organization
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-background-dark px-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold ${
                  step >= 2
                    ? "border-accent bg-accent text-charcoal"
                    : "border-white/20 bg-background-dark text-white/40"
                }`}>
                2
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  step >= 2 ? "text-accent" : "text-white/40"
                }`}>
                Financial
              </span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-background-dark px-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 font-bold ${
                  step >= 3
                    ? "border-accent bg-accent text-charcoal"
                    : "border-white/20 bg-background-dark text-white/40"
                }`}>
                3
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-widest ${
                  step >= 3 ? "text-accent" : "text-white/40"
                }`}>
                Legal
              </span>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
            <div className="p-8 md:p-12">
              <div className="mb-10">
                <h2 className="mb-2 text-3xl font-bold">
                  Professional Organizer Registration
                </h2>
                <p className="text-white/50">
                  {step === 1 &&
                    "Set up your organizer profile and account details."}
                  {step === 2 && "Provide payout information for your events."}
                  {step === 3 &&
                    "Finish legal verification to submit your application."}
                </p>
              </div>

              {error && (
                <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/15 p-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              <form className="space-y-8" onSubmit={handleSubmit}>
                {step === 1 && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <span className="material-symbols-outlined text-accent">
                        business
                      </span>
                      <h3 className="text-lg font-bold">
                        Organization Details
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-medium text-white/70">
                          Organization Name
                        </label>
                        <input
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:ring-accent"
                          name="organizationName"
                          placeholder="e.g. Vintage Film Society"
                          type="text"
                          value={formData.organizationName}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-medium text-white/70">
                          Website (Optional)
                        </label>
                        <input
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:ring-accent"
                          name="website"
                          placeholder="https://"
                          type="url"
                          value={formData.website}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="ml-1 text-sm font-medium text-white/70">
                          Full Name (Representative)
                        </label>
                        <input
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:ring-accent"
                          name="name"
                          placeholder="e.g. Nora Benson"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="ml-1 text-sm font-medium text-white/70">
                          Business Email
                        </label>
                        <input
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:ring-accent"
                          name="email"
                          placeholder="you@company.com"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-medium text-white/70">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white focus:border-accent focus:ring-accent"
                            name="password"
                            placeholder="Minimum 8 characters"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                          />
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}>
                            <span className="material-symbols-outlined text-lg">
                              {showPassword ? "visibility_off" : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-medium text-white/70">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-12 text-white focus:border-accent focus:ring-accent"
                            name="confirmPassword"
                            placeholder="Repeat your password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                          />
                          <button
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword((prev) => !prev)
                            }>
                            <span className="material-symbols-outlined text-lg">
                              {showConfirmPassword
                                ? "visibility_off"
                                : "visibility"}
                            </span>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="ml-1 text-sm font-medium text-white/70">
                          Short Bio
                        </label>
                        <textarea
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-accent focus:ring-accent"
                          name="shortBio"
                          placeholder="Tell us about your experience in organizing cinema events..."
                          rows="3"
                          value={formData.shortBio}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <span className="material-symbols-outlined text-accent">
                        payments
                      </span>
                      <h3 className="text-lg font-bold">
                        Financial Information
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 rounded-xl border border-primary/30 bg-primary/10 p-4">
                        <span className="material-symbols-outlined text-accent">
                          info
                        </span>
                        <p className="text-xs leading-relaxed text-white/70">
                          Your IBAN is required for automated payouts of ticket
                          sales. We use enterprise-grade encryption to ensure
                          your financial data remains secure.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="ml-1 text-sm font-medium text-white/70">
                          IBAN for Future Payouts
                        </label>
                        <input
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-white focus:border-accent focus:ring-accent"
                          name="iban"
                          placeholder="GB00 0000 0000 0000 0000 00"
                          type="text"
                          value={formData.iban}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <span className="material-symbols-outlined text-accent">
                        gavel
                      </span>
                      <h3 className="text-lg font-bold">Legal Verification</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <p className="text-sm text-white/60">
                          Please upload three documents: Company Registration
                          Certificate, Proof of Address, and Identity Document.
                        </p>
                        <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5 p-8 transition-colors hover:border-accent/50 hover:bg-white/10">
                          <span className="material-symbols-outlined mb-2 text-4xl text-white/20 group-hover:text-accent">
                            upload_file
                          </span>
                          <span className="text-sm font-bold text-white">
                            {selectedFiles.length > 0
                              ? `${selectedFiles.length} file(s) selected`
                              : "Upload Documents"}
                          </span>
                          {selectedFiles.length === 0 && (
                            <span className="mt-1 text-xs text-white/40">
                              PDF, JPG or PNG (Max 5MB each) - Select 3 files
                            </span>
                          )}
                          {selectedFiles.length > 0 && (
                            <div className="mt-3 w-full space-y-1 text-left">
                              {selectedFiles.map((file, idx) => (
                                <p
                                  key={idx}
                                  className="truncate text-xs text-white/60">
                                  {idx + 1}. {file.name}
                                </p>
                              ))}
                            </div>
                          )}
                          <input
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            multiple
                            name="legalDocumentName"
                            type="file"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                        <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-accent">
                          Required:
                        </h4>
                        <ul className="space-y-2 text-xs text-white/60">
                          <li className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-green-500">
                              check_circle
                            </span>
                            Company Registration Certificate
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-green-500">
                              check_circle
                            </span>
                            Proof of Address (Last 3 months)
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm text-green-500">
                              check_circle
                            </span>
                            Identity Document of Representative
                          </li>
                        </ul>
                      </div>
                    </div>

                    <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                      <input
                        checked={formData.termsAccepted}
                        className="mt-1"
                        name="termsAccepted"
                        type="checkbox"
                        onChange={handleChange}
                      />
                      I confirm the submitted information is accurate and I
                      accept the organizer terms.
                    </label>

                    <div className="flex items-start gap-4 rounded-xl border border-accent/20 bg-charcoal p-4">
                      <span className="material-symbols-outlined mt-0.5 text-accent">
                        verified_user
                      </span>
                      <div>
                        <p className="mb-1 text-sm font-bold text-accent">
                          Account Validation Notice
                        </p>
                        <p className="text-xs leading-relaxed text-white/50">
                          Your account will be set to{" "}
                          <strong className="text-white">
                            Pending Validation
                          </strong>{" "}
                          upon completion. Our team will review your application
                          within 48 business hours.
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                <div className="flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row">
                  {step > 1 && (
                    <button
                      className="rounded-xl border border-white/20 px-8 py-4 text-sm font-bold transition-colors hover:bg-white/5"
                      type="button"
                      onClick={handlePreviousStep}>
                      Back
                    </button>
                  )}

                  {step < 3 ? (
                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-4 text-sm font-black text-charcoal transition-all hover:scale-[1.02] hover:bg-white"
                      type="button"
                      onClick={handleNextStep}>
                      Next Step
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  ) : (
                    <button
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent py-4 text-sm font-black text-charcoal transition-all hover:scale-[1.02] hover:bg-white disabled:opacity-60"
                      disabled={loading}
                      type="submit">
                      {loading ? "SUBMITTING..." : "COMPLETE REGISTRATION"}
                      <span className="material-symbols-outlined">
                        chevron_right
                      </span>
                    </button>
                  )}

                  <button
                    className="rounded-xl border border-white/20 px-8 py-4 text-sm font-bold transition-colors hover:bg-white/5"
                    type="button"
                    onClick={handleSaveDraft}>
                    Save Progress
                  </button>
                </div>
              </form>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-white/30">
            By registering, you agree to CinéEvent&apos;s{" "}
            <a className="underline hover:text-accent" href="#">
              Organizer Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline hover:text-accent" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
