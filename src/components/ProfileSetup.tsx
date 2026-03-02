import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";

export function ProfileSetup() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const createProfile = useMutation(api.profiles.createProfile);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    try {
      await createProfile({ username: username.trim() });
    } catch (error) {
      console.error("Failed to create profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-emerald-950 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            className="text-6xl mb-4"
            animate={{
              filter: [
                "drop-shadow(0 0 10px #00ff00)",
                "drop-shadow(0 0 30px #00ff00)",
                "drop-shadow(0 0 10px #00ff00)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⌚
          </motion.div>
          <h1 className="font-display text-3xl font-black text-white mb-2">
            DNA SAMPLE DETECTED
          </h1>
          <p className="text-emerald-400 font-mono text-sm">
            Calibrating Omnitrix...
          </p>
        </div>

        <div className="backdrop-blur-xl bg-black/40 border border-emerald-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(0,255,0,0.15)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-emerald-400 text-xs font-mono uppercase tracking-wider mb-2">
                Hero Designation
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your hero name"
                className="w-full px-4 py-3 bg-black/50 border border-emerald-500/30 rounded-lg text-white placeholder-emerald-700 focus:outline-none focus:border-emerald-400 focus:shadow-[0_0_10px_rgba(0,255,0,0.3)] transition-all font-mono"
                maxLength={20}
                required
              />
              <p className="text-emerald-600/60 text-xs font-mono mt-2">
                This name will appear on the leaderboard
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username.trim()}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-400 text-black font-bold uppercase tracking-wider rounded-lg hover:shadow-[0_0_30px_rgba(0,255,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Syncing DNA...
                </span>
              ) : (
                "Initialize Omnitrix"
              )}
            </button>
          </form>
        </div>

        <motion.div
          className="mt-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-emerald-600/40 text-xs font-mono">
            4 alien DNA samples pre-loaded
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
