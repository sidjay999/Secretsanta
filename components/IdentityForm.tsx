"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { EnvelopeReveal } from "./EnvelopeReveal";

type RevealState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; assignedTo: string | null };

export function IdentityForm() {
  const [groups, setGroups] = useState<string[]>([]);
  const [group, setGroup] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [revealState, setRevealState] = useState<RevealState>({ status: "idle" });
  const [showEnvelope, setShowEnvelope] = useState(false);
  
  // Searchable dropdown state
  const [nameSearchQuery, setNameSearchQuery] = useState("");
  const [isNameDropdownOpen, setIsNameDropdownOpen] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<string[]>([]);
  const nameDropdownRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await fetch("/api/groups", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      });
      const json = (await res.json()) as { groups: string[] };
      setGroups(json.groups ?? []);
    };
    fetchGroups().catch(() => {
      setGroups([]);
    });
  }, []);

  useEffect(() => {
    if (!group) {
      setMembers([]);
      setName("");
      setNameSearchQuery("");
      setFilteredMembers([]);
      return;
    }
    const fetchMembers = async () => {
      const res = await fetch(`/api/members?group=${encodeURIComponent(group)}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache"
        }
      });
      const json = (await res.json()) as { members: string[] };
      setMembers(json.members ?? []);
      setName("");
      setNameSearchQuery("");
      setFilteredMembers(json.members ?? []);
    };
    fetchMembers().catch(() => {
      setMembers([]);
      setName("");
      setNameSearchQuery("");
      setFilteredMembers([]);
    });
  }, [group]);

  // Filter members based on search query
  useEffect(() => {
    if (!nameSearchQuery.trim()) {
      setFilteredMembers(members);
    } else {
      const query = nameSearchQuery.toLowerCase().trim();
      const filtered = members.filter((member) =>
        member.toLowerCase().includes(query)
      );
      setFilteredMembers(filtered);
    }
  }, [nameSearchQuery, members]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        nameDropdownRef.current &&
        !nameDropdownRef.current.contains(event.target as Node)
      ) {
        setIsNameDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    if (!group || !name || !code) return;

    setRevealState({ status: "loading" });

    try {
      const res = await fetch("/api/reveal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ groupId: group, name, code })
      });

      const json = (await res.json()) as
        | { ok: true; assignedTo: string }
        | { ok: false; message: string };

      if ("ok" in json && json.ok) {
        setRevealState({ status: "success", assignedTo: json.assignedTo ?? null });
        setShowEnvelope(true);
      } else {
        setRevealState({
          status: "error",
          message: json.message || "Hmm… that doesn’t seem right ❄️ Try again"
        });
      }
    } catch {
      setRevealState({
        status: "error",
        message: "Hmm… that doesn’t seem right ❄️ Try again"
      });
    }
  };

  const isLoading = revealState.status === "loading";

  return (
    <>
      <div className="relative z-10 mx-auto w-full max-w-3xl">
        <motion.div
          className="glass-card rounded-3xl px-6 py-8 shadow-2xl shadow-black/70 sm:px-10 sm:py-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
            <div className="mb-6 text-center">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-200/80">
                🎄 Identify Yourself 🎄
              </p>
              <p className="text-sm text-slate-100/80">
                Choose your private group, find your name, and whisper your secret code to the winter night.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="group" className="text-xs uppercase tracking-[0.18em] text-slate-200/80">
                    Group
                  </label>
                  <select
                    id="group"
                    className="h-11 rounded-xl border border-white/15 bg-slate-900/40 px-3 text-sm text-slate-50 outline-none ring-0 transition focus:border-amberSoft/70 focus:bg-slate-900/70 focus:shadow-glow-teal"
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                  >
                    <option value="">Select group</option>
                    {groups.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs uppercase tracking-[0.18em] text-slate-200/80">
                    Your Name
                  </label>
                  <div ref={nameDropdownRef} className="relative">
                    <input
                      ref={nameInputRef}
                      id="name"
                      type="text"
                      value={nameSearchQuery}
                      onChange={(e) => {
                        setNameSearchQuery(e.target.value);
                        setIsNameDropdownOpen(true);
                        if (!e.target.value) {
                          setName("");
                        }
                      }}
                      onFocus={() => {
                        if (members.length > 0) {
                          setIsNameDropdownOpen(true);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && filteredMembers.length > 0) {
                          e.preventDefault();
                          const firstMatch = filteredMembers[0];
                          setName(firstMatch);
                          setNameSearchQuery(firstMatch);
                          setIsNameDropdownOpen(false);
                        } else if (e.key === "Escape") {
                          setIsNameDropdownOpen(false);
                          nameInputRef.current?.blur();
                        }
                      }}
                      placeholder={
                        !group
                          ? "Select a group first"
                          : members.length === 0
                          ? "No unrevealed names"
                          : "Search or select your name"
                      }
                      disabled={!group || members.length === 0}
                      className="h-11 w-full rounded-xl border border-white/15 bg-slate-900/40 px-3 text-sm text-slate-50 outline-none ring-0 transition focus:border-amberSoft/70 focus:bg-slate-900/70 focus:shadow-glow-teal disabled:cursor-not-allowed disabled:opacity-60"
                    />
                    {isNameDropdownOpen && filteredMembers.length > 0 && (
                      <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur-lg shadow-2xl">
                        {filteredMembers.map((member) => (
                          <button
                            key={member}
                            type="button"
                            onClick={() => {
                              setName(member);
                              setNameSearchQuery(member);
                              setIsNameDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2.5 text-left text-sm text-slate-50 transition hover:bg-slate-800/70 focus:bg-slate-800/70 focus:outline-none first:rounded-t-xl last:rounded-b-xl"
                          >
                            {member}
                          </button>
                        ))}
                      </div>
                    )}
                    {isNameDropdownOpen && nameSearchQuery.trim() && filteredMembers.length === 0 && (
                      <div className="absolute z-50 mt-1 w-full rounded-xl border border-white/15 bg-slate-900/95 backdrop-blur-lg px-3 py-2.5 text-sm text-slate-400">
                        No matches found
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="code" className="text-xs uppercase tracking-[0.18em] text-slate-200/80">
                  Secret Code
                </label>
                <input
                  id="code"
                  type="password"
                  autoComplete="off"
                  className="h-11 rounded-xl border border-white/15 bg-slate-900/40 px-3 text-sm text-slate-50 outline-none ring-0 transition focus:border-amberSoft/70 focus:bg-slate-900/70 focus:shadow-glow-teal"
                  value={code}
                  onChange={(e) => setCode(e.target.value.trim())}
                  placeholder="Type the code given to you"
                />
              </div>

              <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <button
                  type="submit"
                  disabled={isLoading || !group || !name || !code}
                  className="inline-flex items-center justify-center rounded-full bg-amberSoft/90 px-6 py-2.5 text-sm font-medium text-slate-950 shadow-glow-gold outline-none ring-0 transition hover:bg-amberSoft disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Shuffling winter wishes… ✨" : "Confirm & Continue"}
                </button>

                {revealState.status === "error" && (
                  <p className="max-w-xs text-[0.7rem] text-teal-100/90">
                    {revealState.message || "Hmm… that doesn’t seem right ❄️ Try again"}
                  </p>
                )}

                {revealState.status === "idle" && (
                  <p className="max-w-xs text-[0.7rem] text-slate-100/75">
                    all set !!
                  </p>
                )}
              </div>
            </form>
          </motion.div>
        </div>

      <EnvelopeReveal
        visible={showEnvelope}
        assignedTo={revealState.status === "success" ? revealState.assignedTo : null}
        onClose={() => setShowEnvelope(false)}
      />
    </>
  );
}


