
import { useState, useEffect } from 'react';
import GameBoard from '@/components/GameBoard';
import { 
  GameState, 
  initializeGame, 
  getSavedGameState, 
  shouldStartNewGame,
  saveGameState,
  COMPANIES
} from '@/lib/game';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

const Game = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Initialize or load saved game
    let initialState: GameState;
    
    if (shouldStartNewGame()) {
      // Start a new game
      initialState = initializeGame();
      saveGameState(initialState);
      setShowIntro(true);
    } else {
      // Load existing game
      const savedState = getSavedGameState();
      initialState = savedState || initializeGame();
    }
    
    setGameState(initialState);
    setLoading(false);
  }, []);

  // Function to trigger confetti when player wins
  const triggerWinAnimation = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    
    // Use a safer approach for confetti animation
    const runConfetti = () => {
      try {
        const timeLeft = animationEnd - Date.now();
        
        if (timeLeft <= 0) {
          return;
        }
        
        const particleCount = 50 * (timeLeft / duration);
        
        // Since particles fall down, start a bit higher than random
        confetti({
          particleCount,
          origin: { x: Math.random() * 0.3 + 0.1, y: Math.random() - 0.2 },
          zIndex: 100,
          spread: 70,
          startVelocity: 30,
          ticks: 60
        });
        
        confetti({
          particleCount,
          origin: { x: Math.random() * 0.3 + 0.6, y: Math.random() - 0.2 },
          zIndex: 100,
          spread: 70,
          startVelocity: 30,
          ticks: 60
        });
        
        requestAnimationFrame(runConfetti);
      } catch (error) {
        console.error("Error in confetti animation:", error);
      }
    };
    
    runConfetti();
  };

  // Handle game state changes
  const handleGameStateChange = (newState: GameState) => {
    setGameState(newState);
    
    // If player just won, trigger confetti
    if (newState.gameStatus === 'won' && gameState?.gameStatus === 'playing') {
      // Use setTimeout to ensure state is updated before animation
      setTimeout(() => {
        triggerWinAnimation();
      }, 100);
    }
  };

  if (loading || !gameState) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="flex flex-col items-center">
          <motion.div 
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.1, 1, 1.1, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2 
            }}
            className="mb-4"
          >
            <Building2 className="h-16 w-16 text-primary" />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400"
          >
            Loading Corpdle...
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Intro Animation */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1, height: '100vh' }}
            animate={{ opacity: 0, height: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 1.5, delay: 1 }}
            onAnimationComplete={() => setShowIntro(false)}
            className="fixed inset-0 z-50 bg-gradient-to-b from-blue-600 to-indigo-800 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 1 }}
              className="text-center text-white"
            >
              <Building2 className="h-24 w-24 mx-auto mb-4" />
              <h1 className="text-5xl font-bold mb-2">Corpdle</h1>
              <p className="text-xl">Guess the company!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block">
          Corpdle
        </h1>
        <div className="flex justify-center">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground flex items-center gap-1 text-center"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            Guess the company in 6 tries • {COMPANIES.length} companies
            <Sparkles className="h-4 w-4 text-amber-400" />
          </motion.p>
        </div>
      </motion.div>
      
      {/* Game Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <GameBoard 
          gameState={gameState} 
          onGameStateChange={handleGameStateChange} 
        />
      </motion.div>
    </div>
  );
};

export default Game;