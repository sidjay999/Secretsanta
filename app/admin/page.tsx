"use client";

import { adminCreateGroupAction } from "@/app/actions";
import { useState } from "react";

type ResultItem = {
  name: string;
  code: string;
  assignedTo: string;
};

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const [result, setResult] = useState<{ groupId: string; memberCodes: ResultItem[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const response = await adminCreateGroupAction(formData);

    if (response.ok) {
      setResult({
        groupId: response.groupId,
        memberCodes: response.memberCodes
      });
      // Reset form
      const form = document.querySelector("form") as HTMLFormElement;
      if (form) form.reset();
    } else {
      setError(response.message);
    }

    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-winter-vertical px-4 py-10 text-slate-50">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-lg font-semibold tracking-tight">
          Secret Santa Admin · Group Setup
        </h1>
        <p className="mb-6 text-xs text-slate-200/80">
          Use this page only as an organizer. Enter member names, and the system will automatically generate secret codes and Secret Santa assignments.
        </p>

        <form
          action={handleSubmit}
          className="glass-card space-y-4 rounded-2xl px-5 py-6"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="adminKey" className="text-xs uppercase tracking-[0.18em] text-slate-200/80">
              Admin Key
            </label>
            <input
              id="adminKey"
              name="adminKey"
              type="password"
              required
              className="h-10 rounded-lg border border-white/20 bg-slate-900/40 px-3 text-sm text-slate-50 outline-none ring-0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="groupId" className="text-xs uppercase tracking-[0.18em] text-slate-200/80">
              Group ID
            </label>
            <input
              id="groupId"
              name="groupId"
              required
              placeholder="psychmic"
              className="h-10 rounded-lg border border-white/20 bg-slate-900/40 px-3 text-sm text-slate-50 outline-none ring-0"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="members" className="text-xs uppercase tracking-[0.18em] text-slate-200/80">
              Member Names (one per line)
            </label>
            <textarea
              id="members"
              name="members"
              rows={10}
              required
              className="rounded-lg border border-white/20 bg-slate-900/40 px-3 py-2 text-sm text-slate-50 outline-none ring-0"
              placeholder="Jay\nAadya\nRavi\nSarah\nMike\n..."
            />
            <p className="text-[0.65rem] text-slate-200/60">
              Enter one name per line. Secret codes and assignments will be generated automatically.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-amberSoft/90 px-5 py-2 text-xs font-medium text-slate-950 shadow-glow-gold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Generating assignments..." : "Generate Secret Santa Assignments"}
          </button>

          {error && (
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
              {error}
            </div>
          )}

          <p className="text-[0.65rem] text-slate-200/75">
            Assignments are generated once and stored permanently. Each member will receive a unique secret code to reveal their assignment.
          </p>
        </form>

        {result && (
          <div className="glass-card mt-6 space-y-4 rounded-2xl px-5 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-50">
                ✅ Group "{result.groupId}" Created Successfully!
              </h2>
              <button
                onClick={() => {
                  const text = result.memberCodes
                    .map((m) => `${m.name}: ${m.code}`)
                    .join("\n");
                  navigator.clipboard.writeText(text);
                  alert("Codes copied to clipboard!");
                }}
                className="text-xs text-amberSoft hover:text-amber-300"
              >
                Copy All Codes
              </button>
            </div>

            <p className="text-xs text-slate-200/80">
              Distribute these codes to each member. They can use their code on the main page to reveal their Secret Santa assignment.
            </p>

            <div className="max-h-[500px] space-y-2 overflow-y-auto rounded-lg border border-white/10 bg-slate-900/30 p-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-slate-300/80">
                    <th className="pb-2 pr-4 font-semibold uppercase tracking-wider">Name</th>
                    <th className="pb-2 pr-4 font-semibold uppercase tracking-wider">Secret Code</th>
                    <th className="pb-2 font-semibold uppercase tracking-wider">Assigned To</th>
                  </tr>
                </thead>
                <tbody className="text-slate-100">
                  {result.memberCodes.map((member, idx) => (
                    <tr key={idx} className="border-b border-white/5">
                      <td className="py-2 pr-4 font-medium">{member.name}</td>
                      <td className="py-2 pr-4 font-mono text-amberSoft">{member.code}</td>
                      <td className="py-2 text-slate-300">{member.assignedTo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-200/90">
              <strong>⚠️ Important:</strong> Save or copy these codes now. This is the only time you'll see the full assignment list.
              Members will only see their own assignment when they use their code.
            </div>
          </div>
        )}
      </div>
    </main>
  );
}


