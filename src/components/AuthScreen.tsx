import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Anonymous sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-emerald-950 to-black">
        <div className="absolute inset-0 opacity-30">
          <div className="omnitrix-pulse absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500 blur-[120px]" />
          <div className="omnitrix-pulse-delayed absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-green-400 blur-[100px]" />
        </div>
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-4">
            <div className="w-24 h-24 mx-auto relative">
              <div className="absolute inset-0 rounded-full bg-black border-4 border-emerald-400 shadow-[0_0_30px_rgba(0,255,0,0.5)]" />
              <div className="absolute inset-2 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                <span className="text-4xl">⌚</span>
              </div>
              <div className="absolute -inset-2 rounded-full border border-emerald-500/30 animate-ping" />
            </div>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-black text-white tracking-tight mb-2">
            OMNITRIX
          </h1>
          <p className="font-mono text-emerald-400 text-sm tracking-widest uppercase">
            Hero Transformation System
          </p>
        </div>

        {/* Auth Card */}
        <div className="backdrop-blur-xl bg-black/40 border border-emerald-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,255,0,0.15)]">
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setFlow("signIn")}
              className={`flex-1 py-2 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
                flow === "signIn"
                  ? "bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(0,255,0,0.5)]"
                  : "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setFlow("signUp")}
              className={`flex-1 py-2 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
                flow === "signUp"
                  ? "bg-emerald-500 text-black font-bold shadow-[0_0_20px_rgba(0,255,0,0.5)]"
                  : "bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="hero@omnitrix.io"
                className="w-full px-4 py-3 bg-black/50 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-black/50 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all font-mono"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            {error && (
              <div className="text-red-400 text-sm font-mono bg-red-900/20 border border-red-500/30 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-400 text-black font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Activating...
                </span>
              ) : flow === "signIn" ? (
                "Activate Omnitrix"
              ) : (
                "Register DNA"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-emerald-500/20" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-transparent text-emerald-600 text-xs font-mono uppercase">
                or
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAnonymous}
            disabled={isLoading}
            className="w-full py-3 bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 font-mono uppercase tracking-wider rounded-lg hover:bg-emerald-900/50 hover:border-emerald-400/50 transition-all disabled:opacity-50"
          >
            Continue as Guest
          </button>
        </div>

        {/* Footer text */}
        <p className="text-center text-emerald-600/60 text-xs font-mono mt-6">
          DNA sample required for transformation access
        </p>
      </div>
    </div>
  );
}
