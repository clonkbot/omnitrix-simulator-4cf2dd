import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { getAlienById } from "./AlienData";
import { Id } from "../../convex/_generated/dataModel";

interface TransformationEntry {
  _id: Id<"transformations">;
  _creationTime: number;
  userId: Id<"users">;
  alienId: string;
  alienName: string;
  timestamp: number;
  duration: number;
}

interface HistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function History({ isOpen, onClose }: HistoryProps) {
  const history = useQuery(api.transformations.getHistory);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

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
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-gradient-to-b from-black via-emerald-950/50 to-black border-r border-emerald-500/30 z-50 overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-black text-white">
                  HISTORY
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
                {history === undefined ? (
                  <div className="text-center py-8">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </div>
                ) : history.length === 0 ? (
                  <div className="text-center py-8 text-emerald-600/60 font-mono text-sm">
                    No transformations yet
                  </div>
                ) : (
                  history.map((entry: TransformationEntry, index: number) => {
                    const alien = getAlienById(entry.alienId);
                    return (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-500/30"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                            style={{
                              backgroundColor: alien?.color + "22",
                              boxShadow: `0 0 15px ${alien?.color}33`,
                            }}
                          >
                            {alien?.emoji || "❓"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-mono text-white font-bold">
                              {entry.alienName}
                            </h3>
                            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400/70">
                              <span>{formatDate(entry.timestamp)}</span>
                              <span>•</span>
                              <span>{formatTime(entry.timestamp)}</span>
                              {entry.duration > 0 && (
                                <>
                                  <span>•</span>
                                  <span>{entry.duration}s</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
