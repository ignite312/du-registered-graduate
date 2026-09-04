"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Stepper } from "@/components/stepper";
import { Alert, Button, Field, Input, PageIntro } from "@/components/ui";
import { useAppState } from "@/lib/app-context";
import { MOCK_OTP } from "@/lib/constants";
import { verifyOtp } from "@/lib/mock-api";

export default function VerifyOtpPage() {
  return (
    <FlowGate require="otpPending">
      <div className="mx-auto max-w-lg px-4 py-8">
        <Stepper current={1} />
        <PageIntro
          kicker="Account"
          title="OTP verification"
          description="Enter the six-digit code sent to your mobile number. In this demonstration no SMS is sent."
        />
        <OtpForm />
      </div>
    </FlowGate>
  );
}

function OtpForm() {
  const { state, update } = useAppState();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await verifyOtp(code);
      update({ otpVerified: true });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Alert>
        Code sent to {state.phone}. Demonstration OTP: {MOCK_OTP}
      </Alert>
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <Field label="One-time password">
        <Input
          name="otp"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
      </Field>
      <Button type="submit" disabled={busy} className="w-full">
        {busy ? "Verifying…" : "Verify and continue"}
      </Button>
    </form>
  );
}
