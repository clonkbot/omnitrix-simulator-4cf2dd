import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Id } from "../../convex/_generated/dataModel";

interface LeaderboardEntry {
  _id: Id<"leaderboard">;
  _creationTime: number;
  userId: Id<"users">;
  username: string;
  totalTransformations: number;
  uniqueAliens: number;
  lastActive: number;
}

interface LeaderboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Leaderboard({ isOpen, onClose }: LeaderboardProps) {
  const leaderboard = useQuery(api.transformations.getLeaderboard);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-black via-emerald-950/50 to-black border-l border-emerald-500/30 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-black text-white">
                  LEADERBOARD
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-900/50 transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-5 h-5"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3">
                {leaderboard === undefined ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : leaderboard.length === 0 ? (
                  <div className="text-center py-8 text-emerald-600/60 font-mono text-sm">
                    No heroes registered yet
                  </div>
                ) : (
                  leaderboard.map((entry: LeaderboardEntry, index: number) => (
                    <motion.div
                      key={entry._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-xl border ${
                        index === 0
                          ? "bg-yellow-900/20 border-yellow-500/50"
                          : index === 1
                          ? "bg-gray-600/20 border-gray-400/50"
                          : index === 2
                          ? "bg-orange-900/20 border-orange-600/50"
                          : "bg-emerald-900/20 border-emerald-500/30"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-lg ${
                            index === 0
                              ? "bg-yellow-500 text-black"
                              : index === 1
                              ? "bg-gray-400 text-black"
                              : index === 2
                              ? "bg-orange-600 text-white"
                              : "bg-emerald-900/50 text-emerald-400"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-mono text-white font-bold truncate">
                            {entry.username}
                          </h3>
                          <div className="flex items-center gap-3 text-xs font-mono text-emerald-400/70">
                            <span>{entry.totalTransformations} transforms</span>
                            <span>•</span>
                            <span>{entry.uniqueAliens} aliens</span>
                          </div>
                        </div>
                        {index === 0 && (
                          <span className="text-2xl">🏆</span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
