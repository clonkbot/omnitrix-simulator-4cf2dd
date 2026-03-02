import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ALIENS, getAlienById, type Alien } from "./AlienData";
import { motion, AnimatePresence } from "framer-motion";

interface OmnitrixDialProps {
  unlockedAliens: string[];
  currentAlien: string | undefined;
  omnitrixColor: string;
}

export function OmnitrixDial({ unlockedAliens, currentAlien, omnitrixColor }: OmnitrixDialProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransforming, setIsTransforming] = useState(false);
  const [showAlienInfo, setShowAlienInfo] = useState(false);
  const [transformedAlien, setTransformedAlien] = useState<Alien | null>(null);

  const transform = useMutation(api.transformations.transform);
  const revert = useMutation(api.transformations.revert);

  const availableAliens = ALIENS.filter((alien) => unlockedAliens.includes(alien.id));
  const selectedAlien = availableAliens[selectedIndex];

  // Handle dial rotation
  const rotateDial = useCallback(
    (direction: "left" | "right") => {
      if (isTransforming || currentAlien) return;
      setSelectedIndex((prev) => {
        if (direction === "right") {
          return (prev + 1) % availableAliens.length;
        } else {
          return prev === 0 ? availableAliens.length - 1 : prev - 1;
        }
      });
    },
    [isTransforming, currentAlien, availableAliens.length]
  );

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") rotateDial("left");
      if (e.key === "ArrowRight") rotateDial("right");
      if (e.key === "Enter" || e.key === " ") handleActivate();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [rotateDial, selectedAlien, currentAlien]);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = e.changedTouches[0].clientX - touchStart;
    if (Math.abs(diff) > 50) {
      rotateDial(diff > 0 ? "left" : "right");
    }
    setTouchStart(null);
  };

  const handleActivate = async () => {
    if (isTransforming) return;

    if (currentAlien) {
      // Revert transformation
      setIsTransforming(true);
      setTransformedAlien(null);
      await revert({});
      setTimeout(() => setIsTransforming(false), 800);
    } else if (selectedAlien) {
      // Transform
      setIsTransforming(true);
      await transform({
        alienId: selectedAlien.id,
        alienName: selectedAlien.name,
      });
      setTransformedAlien(selectedAlien);
      setTimeout(() => setIsTransforming(false), 1500);
    }
  };

  const currentTransformedAlien = currentAlien ? getAlienById(currentAlien) : null;

  return (
    <div className="flex flex-col items-center gap-6 md:gap-8 w-full">
      {/* Alien Display */}
      <AnimatePresence mode="wait">
        {currentTransformedAlien ? (
          <motion.div
            key="transformed"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="text-center"
          >
            <motion.div
              className="text-8xl md:text-[120px] mb-4"
              animate={{
                filter: [
                  "drop-shadow(0 0 20px " + currentTransformedAlien.color + ")",
                  "drop-shadow(0 0 40px " + currentTransformedAlien.color + ")",
                  "drop-shadow(0 0 20px " + currentTransformedAlien.color + ")",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {currentTransformedAlien.emoji}
            </motion.div>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              {currentTransformedAlien.name}
            </h2>
            <p className="text-emerald-400 font-mono text-sm mt-1">
              {currentTransformedAlien.species}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              key={selectedAlien?.id}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="text-7xl md:text-8xl mb-4 cursor-pointer"
              onClick={() => setShowAlienInfo(!showAlienInfo)}
            >
              {selectedAlien?.emoji}
            </motion.div>
            <h2 className="font-display text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
              {selectedAlien?.name}
            </h2>
            <p className="text-emerald-400/70 font-mono text-xs mt-1">
              Tap alien for info
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alien Info Panel */}
      <AnimatePresence>
        {showAlienInfo && selectedAlien && !currentAlien && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-sm backdrop-blur-xl bg-black/40 border border-emerald-500/30 rounded-xl p-4 overflow-hidden"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs uppercase">Species:</span>
                <span className="text-white font-mono text-sm">{selectedAlien.species}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-mono text-xs uppercase">Planet:</span>
                <span className="text-white font-mono text-sm">{selectedAlien.planet}</span>
              </div>
              <div>
                <span className="text-emerald-400 font-mono text-xs uppercase block mb-2">Powers:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedAlien.powers.map((power) => (
                    <span
                      key={power}
                      className="px-2 py-1 bg-emerald-900/30 border border-emerald-500/30 rounded text-xs text-emerald-300 font-mono"
                    >
                      {power}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-emerald-200/70 text-sm font-mono leading-relaxed">
                {selectedAlien.description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Omnitrix */}
      <div
        className="relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Outer ring */}
        <div
          className="w-56 h-56 md:w-72 md:h-72 rounded-full relative"
          style={{
            background: `conic-gradient(from 0deg, ${omnitrixColor}22, ${omnitrixColor}44, ${omnitrixColor}22)`,
            boxShadow: isTransforming
              ? `0 0 60px ${omnitrixColor}, inset 0 0 30px ${omnitrixColor}44`
              : `0 0 30px ${omnitrixColor}44, inset 0 0 20px ${omnitrixColor}22`,
          }}
        >
          {/* Inner black ring */}
          <div className="absolute inset-4 md:inset-6 rounded-full bg-gradient-to-b from-gray-900 to-black border-4 border-gray-800">
            {/* Green face */}
            <motion.div
              className="absolute inset-3 md:inset-4 rounded-full flex items-center justify-center cursor-pointer"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${omnitrixColor}, ${omnitrixColor}88 70%, ${omnitrixColor}44)`,
                boxShadow: isTransforming
                  ? `0 0 50px ${omnitrixColor}, inset 0 0 30px rgba(255,255,255,0.3)`
                  : `inset 0 0 20px rgba(0,0,0,0.5)`,
              }}
              onClick={handleActivate}
              animate={
                isTransforming
                  ? {
                      scale: [1, 1.1, 1],
                      filter: [
                        "brightness(1)",
                        "brightness(2)",
                        "brightness(1)",
                      ],
                    }
                  : {}
              }
              transition={{ duration: 0.5, repeat: isTransforming ? 2 : 0 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Hourglass symbol */}
              <motion.svg
                viewBox="0 0 100 100"
                className="w-16 h-16 md:w-20 md:h-20"
                animate={
                  isTransforming
                    ? { rotate: [0, 180, 360], scale: [1, 1.2, 1] }
                    : {}
                }
                transition={{ duration: 1.5 }}
              >
                <path
                  d="M30 20 L70 20 L55 50 L70 80 L30 80 L45 50 Z"
                  fill="none"
                  stroke="black"
                  strokeWidth="6"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </motion.div>
          </div>

          {/* Dial indicators */}
          {!currentAlien && (
            <>
              {availableAliens.map((alien, i) => {
                const angle = (i / availableAliens.length) * 360 - 90;
                const isSelected = i === selectedIndex;
                return (
                  <motion.div
                    key={alien.id}
                    className="absolute w-3 h-3 md:w-4 md:h-4 rounded-full cursor-pointer"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-90px) md:translateY(-115px)`,
                      background: isSelected ? alien.color : "#1a1a1a",
                      boxShadow: isSelected ? `0 0 10px ${alien.color}` : "none",
                      border: `2px solid ${isSelected ? alien.color : "#333"}`,
                    }}
                    onClick={() => setSelectedIndex(i)}
                    whileHover={{ scale: 1.3 }}
                    animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5, repeat: isSelected ? Infinity : 0 }}
                  />
                );
              })}
            </>
          )}
        </div>

        {/* Transform flash effect */}
        <AnimatePresence>
          {isTransforming && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0, scale: 1 }}
              animate={{ opacity: [0, 1, 0], scale: [1, 2, 2.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              style={{
                background: `radial-gradient(circle, ${omnitrixColor} 0%, transparent 70%)`,
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        {!currentAlien && (
          <>
            <button
              onClick={() => rotateDial("left")}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-900/30 hover:border-emerald-400 transition-all active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </>
        )}

        <button
          onClick={handleActivate}
          disabled={isTransforming}
          className={`px-6 py-3 md:px-8 md:py-4 rounded-xl font-display font-bold uppercase tracking-wider transition-all transform active:scale-95 disabled:opacity-50 ${
            currentAlien
              ? "bg-red-600 hover:bg-red-500 text-white shadow-[0_0_20px_rgba(255,0,0,0.3)]"
              : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(0,255,0,0.3)]"
          }`}
        >
          {isTransforming
            ? "Transforming..."
            : currentAlien
            ? "Revert"
            : "Transform"}
        </button>

        {!currentAlien && (
          <>
            <button
              onClick={() => rotateDial("right")}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 border border-emerald-500/30 text-emerald-400 flex items-center justify-center hover:bg-emerald-900/30 hover:border-emerald-400 transition-all active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-6 h-6"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Status text */}
      <p className="text-emerald-600/60 font-mono text-xs text-center px-4">
        {currentAlien
          ? "Tap REVERT or the dial to return to human form"
          : "Swipe or use arrows to select • Tap dial to transform"}
      </p>
    </div>
  );
}
