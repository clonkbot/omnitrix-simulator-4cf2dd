import { motion, AnimatePresence } from "framer-motion";
import { ALIENS } from "./AlienData";

interface AlienCollectionProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedAliens: string[];
}

export function AlienCollection({ isOpen, onClose, unlockedAliens }: AlienCollectionProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-gradient-to-br from-black via-emerald-950/50 to-black border border-emerald-500/30 rounded-2xl z-50 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-emerald-500/30">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-black text-white">
                  ALIEN DNA DATABASE
                </h2>
                <p className="text-emerald-400 font-mono text-sm">
                  {unlockedAliens.length} / {ALIENS.length} samples collected
                </p>
              </div>
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

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {ALIENS.map((alien, index) => {
                  const isUnlocked = unlockedAliens.includes(alien.id);
                  return (
                    <motion.div
                      key={alien.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative p-4 rounded-xl border transition-all ${
                        isUnlocked
                          ? "bg-emerald-900/20 border-emerald-500/50 hover:border-emerald-400"
                          : "bg-black/50 border-gray-800 opacity-60"
                      }`}
                    >
                      <div className="text-center">
                        <div
                          className={`text-4xl md:text-5xl mb-2 ${
                            isUnlocked ? "" : "grayscale"
                          }`}
                          style={{
                            filter: isUnlocked
                              ? `drop-shadow(0 0 10px ${alien.color})`
                              : "grayscale(100%)",
                          }}
                        >
                          {isUnlocked ? alien.emoji : "❓"}
                        </div>
                        <h3
                          className={`font-mono text-sm font-bold truncate ${
                            isUnlocked ? "text-white" : "text-gray-600"
                          }`}
                        >
                          {isUnlocked ? alien.name : "???"}
                        </h3>
                        <p
                          className={`font-mono text-xs mt-1 ${
                            isUnlocked ? "text-emerald-400/70" : "text-gray-700"
                          }`}
                        >
                          {isUnlocked ? alien.species : "Unknown"}
                        </p>
                      </div>

                      {isUnlocked && (
                        <div
                          className="absolute top-2 right-2 w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: alien.color,
                            boxShadow: `0 0 8px ${alien.color}`,
                          }}
                        />
                      )}

                      {!isUnlocked && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="w-8 h-8 text-gray-700"
                          >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                          </svg>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Progress bar */}
            <div className="p-4 md:p-6 border-t border-emerald-500/30">
              <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-green-400"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(unlockedAliens.length / ALIENS.length) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
              <p className="text-center text-emerald-600/60 font-mono text-xs mt-2">
                Collect more aliens by exploring the universe!
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
