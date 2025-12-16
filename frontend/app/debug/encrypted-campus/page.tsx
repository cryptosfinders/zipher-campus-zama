"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { encryptedCampus } from "@/lib/encrypted-campus-instance";

export default function EncryptedCampusDebugPage() {
  const { address } = useAccount();
  const [loading, setLoading] = useState<string | null>(null);
  const [log, setLog] = useState<string>("");

  function appendLog(line: string) {
    setLog((prev) => (prev ? prev + "\n" + line : line));
    console.log(line);
  }

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 max-w-md w-full text-center">
          <h1 className="text-xl font-semibold mb-2">
            Encrypted Campus Debug
          </h1>
          <p className="text-sm text-slate-300">
            No wallet connected. Open your usual connect-wallet UI, connect on
            <span className="font-mono font-semibold"> Sepolia</span>, then come back here.
          </p>
        </div>
      </div>
    );
  }

  async function handleSetMembership() {
    try {
      setLoading("membership");
      appendLog(`→ Setting membership for ${address} in group "solana-school"...`);

      const txHash = await encryptedCampus.setMembershipPlain({
        groupLabel: "solana-school",
        user: address,
        isActive: true,
      });

      appendLog(`✅ setMembershipPlain tx: ${txHash}`);
    } catch (err: any) {
      appendLog(`❌ setMembershipPlain error: ${err?.message || String(err)}`);
    } finally {
      setLoading(null);
    }
  }

  async function handleInitReputation() {
    try {
      setLoading("reputation");
      appendLog(
        `→ Init + add reputation for ${address} in group "solana-school"...`,
      );

      // First init to 10
      const initHash = await encryptedCampus.initReputationPlain({
        groupLabel: "solana-school",
        user: address,
        initialValue: 10n,
      });
      appendLog(`✅ initReputationPlain tx: ${initHash}`);

      // Then add +5
      const addHash = await encryptedCampus.addReputationPlain({
        groupLabel: "solana-school",
        user: address,
        delta: 5n,
      });
      appendLog(`✅ addReputationPlain tx: ${addHash}`);

      // Read encrypted handle
      const handle = await encryptedCampus.getReputationHandle({
        groupLabel: "solana-school",
        user: address,
      });

      appendLog(`🔐 reputation handle: ${handle}`);
    } catch (err: any) {
      appendLog(`❌ reputation flow error: ${err?.message || String(err)}`);
    } finally {
      setLoading(null);
    }
  }

  async function handleIncrementMetric() {
    try {
      setLoading("metric");
      appendLog(`→ Incrementing metric "total-campus-checkins" by 1...`);

      const hash = await encryptedCampus.incrementMetricPlain({
        metricLabel: "total-campus-checkins",
        delta: 1n,
      });

      appendLog(`✅ incrementMetricPlain tx: ${hash}`);

      const handle = await encryptedCampus.getMetricHandle({
        metricLabel: "total-campus-checkins",
      });

      appendLog(`🔐 metric handle: ${handle}`);
    } catch (err: any) {
      appendLog(`❌ metric flow error: ${err?.message || String(err)}`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <div className="max-w-3xl mx-auto py-10 px-4 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold">
            🔐 Encrypted Campus – Debug Panel
          </h1>
          <p className="text-sm text-slate-300">
            Connected as{" "}
            <span className="font-mono text-xs bg-slate-900 px-2 py-1 rounded">
              {address}
            </span>
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <button
            onClick={handleSetMembership}
            disabled={!!loading}
            className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-left hover:bg-slate-800/80 disabled:opacity-50"
          >
            <div className="font-semibold mb-1">
              {loading === "membership" ? "Working…" : "Set membership"}
            </div>
            <div className="text-xs text-slate-300">
              Group: <span className="font-mono">"solana-school"</span> → active
              = true
            </div>
          </button>

          <button
            onClick={handleInitReputation}
            disabled={!!loading}
            className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-left hover:bg-slate-800/80 disabled:opacity-50"
          >
            <div className="font-semibold mb-1">
              {loading === "reputation" ? "Working…" : "Reputation + Read handle"}
            </div>
            <div className="text-xs text-slate-300">
              Init = 10, then +5. Logs encrypted handle.
            </div>
          </button>

          <button
            onClick={handleIncrementMetric}
            disabled={!!loading}
            className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-left hover:bg-slate-800/80 disabled:opacity-50"
          >
            <div className="font-semibold mb-1">
              {loading === "metric" ? "Working…" : "Increment metric"}
            </div>
            <div className="text-xs text-slate-300">
              Metric: <span className="font-mono">"total-campus-checkins"</span>
            </div>
          </button>
        </section>

        <section className="space-y-2">
          <div className="text-xs font-semibold text-slate-400">
            Console log
          </div>
          <pre className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 text-[11px] max-h-72 overflow-auto whitespace-pre-wrap">
{log || "No actions yet. Click a button above to interact with EncryptedCampusState."}
          </pre>
        </section>
      </div>
    </div>
  );
}
