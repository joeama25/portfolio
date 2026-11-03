"use client"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function SignInForm() {
  const router = useRouter(); const [error, setError] = useState(""); const [pending, setPending] = useState(false)
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setPending(true); setError(""); const form = new FormData(event.currentTarget); const result = await authClient.signIn.email({ email: String(form.get("email")), password: String(form.get("password")) }); setPending(false); if (result.error) { setError("Unable to sign in with those details."); return } router.push("/admin"); router.refresh() }
  return <main className="auth-shell"><form className="auth-card" onSubmit={submit}><p className="eyebrow">JOE AMA / ADMIN</p><h1>Welcome back.</h1><p className="auth-copy">Sign in to manage your portfolio.</p><label>Email<input name="email" type="email" defaultValue="joeama25@gmail.com" required /></label><label>Password<input name="password" type="password" required /></label>{error && <p className="auth-error" role="alert">{error}</p>}<button type="submit" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button><a href="/sign-up">Create admin account</a><a href="/">Back to portfolio</a></form></main>
}
