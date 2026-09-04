"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Stepper } from "@/components/stepper";
import { Alert, Button, Field, Input, PageIntro, TextLink } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { sendOtp } from "@/lib/mock-api";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Stepper current={0} />
      <PageIntro
        kicker="Account"
        title="Register"
        description="Create an account with your mobile number. A one-time password will be issued for verification."
      />
      <RegisterForm />
    </div>
  );
}

function RegisterForm() {
  const { update } = useAppState();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      await sendOtp(phone);
      update({
        phone,
        password,
        otpSent: true,
        otpVerified: false,
        loggedIn: false,
        academic: null,
        eligibility: "unchecked",
        eligibilityReasons: [],
        lookup: "idle",
        isExistingRg: false,
        profile: null,
        membership: null,
        payment: null,
      });
      router.push("/verify-otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send OTP.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Field label="Mobile number" hint="Bangladesh format: 01XXXXXXXXX">
        <Input
          name="phone"
          inputMode="numeric"
          autoComplete="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value.trim())}
          placeholder="01XXXXXXXXX"
        />
      </Field>
      <Field label="Password">
        <Input
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <Field label="Confirm password">
        <Input
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
      </Field>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Sending OTP…" : "Send OTP"}
      </Button>
      <p className="text-sm text-du-muted">
        Already registered? <TextLink href="/login">Sign in</TextLink>
      </p>
    </form>
  );
}
