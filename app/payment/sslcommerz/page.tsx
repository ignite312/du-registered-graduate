"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { FlowGate } from "@/components/flow-gate";
import { Alert, Button } from "@/components/ui";
import { LIFETIME_FEE_BDT, SESSION_FEE_BDT } from "@/lib/constants";
import { useAppState } from "@/lib/app-context";
import { createSslcommerzSession } from "@/lib/mock-api";
import { sessionExpiryDate } from "@/lib/membership";

export default function SslcommerzPage() {
  return (
    <FlowGate require="membershipChosen">
      <Suspense fallback={<p className="px-4 py-16 text-center text-sm text-du-muted">Loading checkout…</p>}>
        <SslcommerzCheckout />
      </Suspense>
    </FlowGate>
  );
}

const METHOD_LABEL: Record<string, string> = {
  bkash: "bKash",
  nagad: "Nagad",
  card: "Visa / Mastercard",
  ibank: "Internet banking",
};

function SslcommerzCheckout() {
  const params = useSearchParams();
  const method = params.get("method") ?? "bkash";
  const { state, update } = useAppState();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const amount = state.membership === "lifetime" ? LIFETIME_FEE_BDT : SESSION_FEE_BDT;

  async function pay() {
    if (!state.membership) return;
    setBusy(true);
    setError("");
    try {
      const receipt = await createSslcommerzSession({
        membership: state.membership,
        amountBdt: amount,
        method: METHOD_LABEL[method] ?? method,
      });
      update({
        payment: receipt,
        heldMembership:
          receipt.membership === "lifetime"
            ? { type: "lifetime", expiresAt: null }
            : { type: "session", expiresAt: sessionExpiryDate() },
      });
      router.push("/payment/success");
    } catch {
      setError("Payment could not be completed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="border border-du-line bg-du-paper">
        <div className="border-b border-du-line px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-du-muted">Hosted checkout</p>
          <p className="font-serif text-xl text-du-purple-deep">SSLCOMMERZ</p>
        </div>
        <div className="space-y-4 px-4 py-5 text-sm">
          <p className="text-du-muted">Merchant: University of Dhaka — Registered Graduate</p>
          <p>
            Amount payable:{" "}
            <strong>৳{amount.toLocaleString("en-BD")}</strong>
          </p>
          <p>Selected channel: {METHOD_LABEL[method] ?? method}</p>
          <Alert>
            Sandbox only. Confirming payment records a mock receipt and gate pass. No funds are transferred.
          </Alert>
          {error ? <Alert tone="danger">{error}</Alert> : null}
          <Button type="button" onClick={pay} disabled={busy} className="w-full">
            {busy ? "Processing…" : "Confirm payment"}
          </Button>
          <button
            type="button"
            className="w-full text-center text-sm text-du-muted hover:underline"
            onClick={() => router.push("/payment")}
          >
            Cancel and return
          </button>
        </div>
      </div>
    </div>
  );
}
