"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@carz.com.br");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault(); setLoading(true); setError("");
    const response = await fetch("/api/v1/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (!response.ok) { setError((await response.json()).error || "Não foi possível entrar."); setLoading(false); return; }
    router.replace("/"); router.refresh();
  }
  return <main className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4"><form onSubmit={submit} className="w-full max-w-sm rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-4"><div><h1 className="text-xl font-bold">CarZ</h1><p className="text-sm text-zinc-400">Acesse sua garagem.</p></div><input className="w-full rounded bg-zinc-950 border border-zinc-700 p-2" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail" required /><input className="w-full rounded bg-zinc-950 border border-zinc-700 p-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Senha" required />{error && <p className="text-sm text-rose-400">{error}</p>}<button className="w-full rounded bg-blue-600 p-2 font-semibold disabled:opacity-50" disabled={loading}>{loading ? "Entrando…" : "Entrar"}</button><p className="text-xs text-zinc-500">Ambiente inicial: admin@carz.com.br / admin123</p></form></main>;
}
