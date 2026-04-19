"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { APP_CONFIG } from "@/config/app";
import type { User } from "@supabase/supabase-js";

export default function AccountTab({ user }: { user: User }) {
  const [newEmail, setNewEmail]         = useState("");
  const [emailSent, setEmailSent]       = useState(false);
  const [emailError, setEmailError]     = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  const [newPassword, setNewPassword]   = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaved, setPwSaved]           = useState(false);
  const [pwError, setPwError]           = useState("");
  const [pwLoading, setPwLoading]       = useState(false);

  const [deleteConfirm, setDeleteConfirm] = useState("");

  async function handleEmailUpdate(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    setEmailError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email: newEmail });
    if (error) { setEmailError(error.message); setEmailLoading(false); return; }
    setEmailSent(true);
    setEmailLoading(false);
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPwError("Passwords don't match."); return; }
    if (newPassword.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    setPwLoading(true);
    setPwError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) { setPwError(error.message); setPwLoading(false); return; }
    setPwSaved(true);
    setNewPassword("");
    setConfirmPassword("");
    setPwLoading(false);
    setTimeout(() => setPwSaved(false), 3000);
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-headline text-2xl font-bold italic text-on-surface">Account</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Manage your login credentials.
        </p>
      </div>

      <div className="space-y-5">
        {/* Email */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)]">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-4">Email address</h3>
          <p className="font-body text-sm text-on-surface-variant mb-4">
            Current: <span className="text-on-surface font-medium">{user.email}</span>
          </p>

          {emailSent ? (
            <p className="font-body text-sm flex items-center gap-2" style={{ color: "#3a7d44" }}>
              <span className="material-symbols-outlined text-base">check_circle</span>
              Confirmation sent to {newEmail}. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleEmailUpdate} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email" required value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email address"
                className="flex-1 bg-surface-container-low rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none border-none"
              />
              <button
                type="submit" disabled={emailLoading}
                className="cta-gradient text-on-primary px-6 py-3 rounded-full font-body font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                {emailLoading ? "Sending…" : "Update email"}
              </button>
            </form>
          )}
          {emailError && <p className="font-body text-xs text-error mt-2">{emailError}</p>}
        </section>

        {/* Password */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)]">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-outline mb-4">Password</h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-3">
            <input
              type="password" value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min. 8 characters)"
              className="w-full bg-surface-container-low rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none border-none"
            />
            <input
              type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-surface-container-low rounded-[10px] px-4 py-3 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:bg-surface-container-lowest outline-none border-none"
            />
            {pwError && <p className="font-body text-xs text-error">{pwError}</p>}
            <div className="flex items-center gap-4 pt-1">
              <button
                type="submit" disabled={pwLoading || !newPassword || !confirmPassword}
                className="cta-gradient text-on-primary px-6 py-3 rounded-full font-body font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50"
              >
                {pwLoading ? "Updating…" : "Update password"}
              </button>
              {pwSaved && (
                <span className="flex items-center gap-1.5 font-body text-sm font-medium" style={{ color: "#3a7d44" }}>
                  <span className="material-symbols-outlined text-base leading-none">check_circle</span>
                  Updated
                </span>
              )}
            </div>
          </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-surface-container-lowest rounded-[14px] p-6 shadow-[0_1px_4px_rgba(92,46,0,0.06)] border border-error/20">
          <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-error mb-1">Danger zone</h3>
          <p className="font-body text-xs text-on-surface-variant mb-4">
            Deleting your account is permanent. All your recipes and profile data will be removed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="text" value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder={`Type "delete" to confirm`}
              className="bg-surface-container-low rounded-[10px] px-4 py-2.5 font-body text-sm text-on-surface placeholder:text-outline focus:ring-1 focus:ring-error focus:bg-surface-container-lowest outline-none border-none"
            />
            <a
              href={`mailto:${APP_CONFIG.supportEmail}?subject=Delete my account&body=Please delete my account. Email: ${user.email}`}
              className={`px-6 py-2.5 rounded-full font-body font-bold text-sm transition-all whitespace-nowrap ${
                deleteConfirm === "delete"
                  ? "bg-error text-on-error hover:opacity-90"
                  : "bg-surface-container text-outline cursor-not-allowed pointer-events-none opacity-50"
              }`}
            >
              Delete account
            </a>
          </div>
          <p className="font-body text-xs text-on-surface-variant mt-3 italic">
            This will open an email to our support team to process the deletion.
          </p>
        </section>
      </div>
    </div>
  );
}
