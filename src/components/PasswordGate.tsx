import { useState } from "react";
import { Lock } from "lucide-react";

const PASS_KEY = "mv-intelligence-auth";
const PASSWORD = "gigi";

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
        className="w-full max-w-sm space-y-8 text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            MV Intelligence
          </h1>
          <p className="text-[12px] text-muted-foreground">
            Enter password to continue
          </p>
        </div>

        <input
          type="password"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          autoFocus
          className={`w-full px-4 py-3 text-sm border text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-all bg-transparent ${
            error ? "border-destructive" : "border-foreground/20"
          }`}
        />

        {error && (
          <p className="text-[11px] text-destructive font-medium">
            Incorrect password
          </p>
        )}

        <button
          type="submit"
          className="w-full py-3 text-[13px] font-semibold border border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          Access Briefing
        </button>
      </form>
    </div>
  );
};
