import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/slices/authSlice";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export default function OrganizerVerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyOrganizerLink = async () => {
      if (!token) {
        setError("Verification token is missing");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/auth/organizer-verify/${token}`,
        );
        const data = await response.json();

        if (!response.ok) {
          setError(data.message || "Verification link is invalid or expired");
          setLoading(false);
          return;
        }

        // Successfully verified, log in the organizer
        dispatch(setCredentials(data));
        setSuccess(true);
        setLoading(false);
      } catch (err) {
        setError(err.message || "An error occurred during verification");
        setLoading(false);
      }
    };

    verifyOrganizerLink();
  }, [token, navigate, dispatch]);

  if (loading) {
    return (
      <div className="flex-1 bg-background-dark text-white">
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-accent/20 p-6">
                <span className="material-symbols-outlined animate-spin text-6xl text-accent">
                  sync
                </span>
              </div>
            </div>
            <h1 className="mb-4 text-3xl font-bold">Verifying Your Email</h1>
            <p className="text-white/60">
              Please wait while we verify your organizer approval link...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-background-dark text-white">
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-red-500/20 p-6">
                  <span className="material-symbols-outlined text-6xl text-red-500">
                    error
                  </span>
                </div>
              </div>
              <h1 className="mb-4 text-3xl font-bold">Verification Failed</h1>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
              <div className="p-8 md:p-12">
                <div className="mb-6 rounded-lg border border-red-500/40 bg-red-500/15 p-4 text-sm text-red-200">
                  {error}
                </div>

                <div className="space-y-3 text-sm text-white/70">
                  <p>Here are some things you can try:</p>
                  <ul className="list-inside list-disc space-y-2 ml-2">
                    <li>Make sure you copied the entire link from the email</li>
                    <li>
                      Check that the link hasn't expired (links expire after 24
                      hours)
                    </li>
                    <li>
                      Wait for the approval email from CineEvent admin team if
                      you haven't received it yet
                    </li>
                    <li>Contact support if the issue persists</li>
                  </ul>
                </div>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <button
                    onClick={() => navigate("/")}
                    className="w-full rounded-xl bg-accent py-4 text-sm font-black text-charcoal transition-all hover:scale-[1.02] hover:bg-white">
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex-1 bg-background-dark text-white">
        <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-2xl">
            <div className="text-center mb-8">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-green-500/20 p-6">
                  <span className="material-symbols-outlined text-6xl text-green-500">
                    check_circle
                  </span>
                </div>
              </div>
              <h1 className="mb-4 text-3xl font-bold">Welcome Back!</h1>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl">
              <div className="p-8 md:p-12">
                <div className="mb-6 rounded-lg border border-green-500/40 bg-green-500/15 p-4 text-sm text-green-200">
                  Your organizer account was validated successfully!
                </div>

                <p className="text-center text-white/70">
                  You can now access your organizer dashboard.
                </p>

                <div className="mt-8 border-t border-white/10 pt-6">
                  <button
                    onClick={() => navigate("/organizer/dashboard")}
                    className="w-full rounded-xl bg-accent py-4 text-sm font-black text-charcoal transition-all hover:scale-[1.02] hover:bg-white">
                    Go to Organizer Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
}
