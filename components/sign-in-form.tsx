"use client"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Eye, EyeOff } from "lucide-react"

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    
    const form = new FormData(event.currentTarget);
    
    const result = await authClient.signIn.email({
      email: String(form.get("email")),
      password: String(form.get("password")),
    });

    setPending(false);

    if (result.error) {
      console.log("Sign In Error:", result.error); // Helps debugging
      setError("Unable to sign in with those details.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">JOE AMA / ADMIN</p>
        <h1>Welcome back.</h1>
        <p className="auth-copy">Sign in to manage your portfolio.</p>
        
        <label>
          Email
          <input name="email" type="email" defaultValue="joeama25@gmail.com" required />
        </label>
        
        <label>
          Password
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              style={{ width: '100%', paddingRight: '40px' }} // Makes room for the icon
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ 
                position: 'absolute', 
                right: '10px', 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center'
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>

        {error && <p className="auth-error" role="alert">{error}</p>}
        
        <button type="submit" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
        
        <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', textAlign: 'center' }}>
          <a href="/sign-up">Create admin account</a>
          <a href="/" style={{ opacity: 0.7 }}>Back to portfolio</a>
        </div>
      </form>
    </main>
  );
}