"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, Button, Field, Input, PageIntro, TextLink } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { MOCK_OTP } from "@/lib/constants";
import { resetPassword, sendOtp } from "@/lib/mock-api";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <PageIntro
        kicker="Account"
        title="Forgot password"
        description="Reset the account password with the registered mobile number and SMS OTP."
      />
      <ForgotForm />
    </div>
  );
}

function ForgotForm() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [phone, setPhone] = useState(state.phone);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendOtp(phone);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP.");
    } finally {
      setBusy(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await resetPassword(phone, code, password, state.phone);
      update({ password });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={sent ? save : send} className="space-y-4">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      {sent ? <Alert>Demonstration OTP for {phone}: {MOCK_OTP}</Alert> : null}
      <Field label="Mobile number">
        <Input
          required
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(e.target.value.trim())}
        />
      </Field>
      {sent ? (
        <>
          <Field label="OTP">
            <Input required maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
          </Field>
          <Field label="New password">
            <Input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Field>
        </>
      ) : null}
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Please wait…" : sent ? "Update password" : "Send OTP"}
      </Button>
      <p className="text-sm text-du-muted">
        <TextLink href="/login">Return to sign in</TextLink>
      </p>
    </form>
  );
}
