import { useState } from "react";
import { Lock } from "lucide-react";

const PASS_KEY = "mv-intelligence-auth";
const PASSWORD = "mvintel2026";

export const PasswordGate = ({ children }: { children: React.ReactNode }) => {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(PASS_KEY) === "true"
  );
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === PASSWORD) {
      sessionStorage.setItem(PASS_KEY, "true");
      setAuthenticated(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xs space-y-6 text-center"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 flex items-center justify-center">
            <Lock className="h-4 w-4 text-primary" />
          </div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-foreground">
            MV Intelligence
          </p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em]">
            Enter password to continue
          </p>
        </div>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          autoFocus
          className={`w-full px-4 py-2.5 text-[11px] bg-card border text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-primary transition-all ${
            error ? "border-destructive ring-1 ring-destructive" : "border-border"
          }`}
        />

        {error && (
          <p className="text-[9px] text-destructive uppercase tracking-[0.15em] font-medium">
            Incorrect password
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Access Briefing
        </button>
      </form>
    </div>
  );
};
