"use client"
import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Eye, EyeOff } from "lucide-react"

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    
    if (email.toLowerCase() !== "joeama25@gmail.com") {
      setError("This workspace is reserved for the portfolio owner.");
      setPending(false);
      return;
    }

    const result = await authClient.signUp.email({
      email,
      password: String(form.get("password")),
      name: String(form.get("name")),
    });

    setPending(false);

    if (result.error) {
      console.log("Error details:", result.error);
      setError("Unable to create the account.");
      return;
    }
    
    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="auth-shell">
      <form className="auth-card" onSubmit={submit}>
        <p className="eyebrow">JOE AMA / ADMIN</p>
        <h1>Create access.</h1>
        <p className="auth-copy">Set up the private portfolio workspace.</p>
        
        <label>
          Name
          <input name="name" defaultValue="Joe Ama" required />
        </label>
        
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
              minLength={8} 
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
          {pending ? "Creating…" : "Create account"}
        </button>
        <a href="/sign-in">Already have access? Sign in</a>
      </form>
    </main>
  );
}