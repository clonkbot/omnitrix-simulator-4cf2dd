import { useState } from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { AuthScreen } from "./components/AuthScreen";
import { ProfileSetup } from "./components/ProfileSetup";
import { OmnitrixDial } from "./components/OmnitrixDial";
import { Leaderboard } from "./components/Leaderboard";
import { History } from "./components/History";
import { AlienCollection } from "./components/AlienCollection";
import { motion } from "framer-motion";

function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { signOut } = useAuthActions();
  const profile = useQuery(api.profiles.getProfile);

  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showCollection, setShowCollection] = useState(false);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 20px rgba(0, 255, 0, 0.3)",
                "0 0 40px rgba(0, 255, 0, 0.6)",
                "0 0 20px rgba(0, 255, 0, 0.3)",
              ],
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-3xl">⌚</span>
          </motion.div>
          <p className="text-emerald-400 font-mono text-sm">Initializing Omnitrix...</p>
        </motion.div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // No profile yet
  if (profile === undefined) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (profile === null) {
    return <ProfileSetup />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-emerald-950/30 to-black relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-green-400/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(true)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-900/30 hover:border-emerald-400 transition-all"
            title="History"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </button>
        </div>

        <div className="text-center">
          <h1 className="font-display text-lg md:text-xl font-black text-white tracking-tight">
            {profile.username}
          </h1>
          <p className="text-emerald-400/70 font-mono text-xs">
            {profile.totalTransformations} transformations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-900/30 hover:border-emerald-400 transition-all"
            title="Leaderboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-5 h-5"
            >
              <path d="M8.21 13.89L7 23l5-3 5 3-1.21-9.11" />
              <circle cx="12" cy="8" r="7" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 md:py-8 relative z-10">
        <OmnitrixDial
          unlockedAliens={profile.unlockedAliens}
          currentAlien={profile.currentAlien}
          omnitrixColor={profile.omnitrixColor}
        />
      </main>

      {/* Bottom navigation */}
      <nav className="relative z-10 flex items-center justify-center gap-4 p-4 md:p-6">
        <button
          onClick={() => setShowCollection(true)}
          className="px-4 py-2 md:px-6 md:py-3 bg-black/50 border border-emerald-500/30 text-emerald-400 font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-emerald-900/30 hover:border-emerald-400 transition-all flex items-center gap-2"
        >
          <span>👽</span>
          <span className="hidden sm:inline">Collection</span>
          <span className="bg-emerald-900/50 px-2 py-0.5 rounded text-xs">
            {profile.unlockedAliens.length}
          </span>
        </button>

        <button
          onClick={() => signOut()}
          className="px-4 py-2 md:px-6 md:py-3 bg-red-900/30 border border-red-500/30 text-red-400 font-mono text-sm uppercase tracking-wider rounded-lg hover:bg-red-900/50 hover:border-red-400 transition-all"
        >
          Sign Out
        </button>
      </nav>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-4 px-4">
        <p className="text-emerald-700/40 text-xs font-mono">
          Requested by @web-user · Built by @clonkbot
        </p>
      </footer>

      {/* Modals */}
      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
      <History isOpen={showHistory} onClose={() => setShowHistory(false)} />
      <AlienCollection
        isOpen={showCollection}
        onClose={() => setShowCollection(false)}
        unlockedAliens={profile.unlockedAliens}
      />
    </div>
  );
}

export default App;
