"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Stepper } from "@/components/stepper";
import { Alert, Button, Field, Input, PageIntro, TextLink } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { nextPath } from "@/lib/flow";
import { login } from "@/lib/mock-api";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <Stepper current="login" />
      <PageIntro
        kicker="Account"
        title="Sign in"
        description="Use the verified mobile number and password created during registration."
      />
      <LoginForm />
    </div>
  );
}

function LoginForm() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const phoneValue = phone || state.phone;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!state.otpVerified || !state.phone) {
      setError("Please register and verify OTP before signing in.");
      return;
    }
    setBusy(true);
    try {
      await login(phoneValue, password, { phone: state.phone, password: state.password });
      update({ loggedIn: true });
      router.push(nextPath({ ...state, loggedIn: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Field label="Mobile number">
        <Input
          name="phone"
          inputMode="numeric"
          autoComplete="tel"
          required
          value={phoneValue}
          onChange={(e) => setPhone(e.target.value.trim())}
        />
      </Field>
      <Field label="Password">
        <Input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-sm text-du-muted">
        New applicant? <TextLink href="/register">Register</TextLink>
      </p>
      <p className="text-sm text-du-muted">
        <TextLink href="/forgot-password">Forgot password</TextLink>
      </p>
    </form>
  );
}
