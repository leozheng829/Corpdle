
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import { 
  GameState, 
  makeGuess, 
  HINT_LABELS,
  updateGameStats,
  saveGameState,
  setLastPlayedDate,
  initializeGame,
  COMPANIES
} from '@/lib/game';
import { Sparkles, Trophy, AlertCircle, RefreshCw, Zap, CheckCircle, XCircle, Clock, Building2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameBoardProps {
  gameState: GameState;
  onGameStateChange: (newState: GameState) => void;
}

const GameBoard = ({ gameState, onGameStateChange }: GameBoardProps) => {
  const [guessInput, setGuessInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      updateGameStats(gameState);
      setLastPlayedDate();
    }
  }, [gameState.gameStatus]);
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current && gameState.gameStatus === 'playing') {
      inputRef.current.focus();
    }
  }, [gameState.gameStatus]);
  
  // Calculate time until next day
  useEffect(() => {
    const updateTimeLeft = () => {
      const now = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const diffMs = tomorrow.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${diffHrs}h ${diffMins}m`);
    };
    
    updateTimeLeft();
    const interval = setInterval(updateTimeLeft, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleGuessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    if (!guessInput.trim()) {
      toast.error('Please enter a guess');
      return;
    }
    
    if (gameState.guesses.some(g => g.toLowerCase() === guessInput.toLowerCase())) {
      toast.error('You already guessed that company');
      return;
    }
    
    setIsSubmitting(true);
    
    // Add a small delay for animation effect
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const newState = makeGuess(gameState, guessInput);
    onGameStateChange(newState);
    saveGameState(newState);
    setGuessInput('');
    
    if (newState.gameStatus === 'won') {
      toast.success('Congratulations! You guessed correctly!', {
        icon: <Trophy className="h-5 w-5 text-yellow-500" />
      });
    } else if (newState.gameStatus === 'lost') {
      toast.error(`Game over! The company was ${gameState.currentCompany?.name}`, {
        icon: <AlertCircle className="h-5 w-5" />
      });
    } else if (newState.revealedHints.length > gameState.revealedHints.length) {
      // A new hint was revealed after a wrong guess
      const newHint = newState.revealedHints[newState.revealedHints.length - 1];
      toast.info(`New hint revealed: ${HINT_LABELS[newHint]}`, {
        icon: <Sparkles className="h-5 w-5 text-amber-400" />
      });
    }
    
    setIsSubmitting(false);
    
    // Re-focus the input after submission
    if (inputRef.current && newState.gameStatus === 'playing') {
      inputRef.current.focus();
    }
  };
  
  const handlePlayAgain = () => {
    try {
      const newState = initializeGame();
      onGameStateChange(newState);
      saveGameState(newState);
      setShowAnswer(false);
      toast.success('New company selected! Good luck!', {
        icon: <RefreshCw className="h-5 w-5 text-green-500" />
      });
    } catch (error) {
      console.error("Error in handlePlayAgain:", error);
      toast.error('Something went wrong. Please refresh the page.');
    }
  };

  const handleGiveUp = () => {
    if (gameState.gameStatus !== 'playing') return;
    
    try {
      const newState = {
        ...gameState,
        gameStatus: 'lost'
      };
      
      onGameStateChange(newState);
      saveGameState(newState);
      setShowAnswer(true);
      toast.error(`Game over! The company was ${gameState.currentCompany?.name}`);
    } catch (error) {
      console.error("Error in handleGiveUp:", error);
      toast.error('Something went wrong. Please refresh the page.');
    }
  };
  
  // Function to render color pills for brand colors
  const renderColorPills = (colors: string | undefined) => {
    // Add a safety check to handle undefined colors
    if (!colors) return null;
    
    return colors.split(', ').map((color, index) => {
      // Map common color names to actual colors
      const colorMap: Record<string, string> = {
        'Red': 'bg-red-500',
        'Blue': 'bg-blue-500',
        'Green': 'bg-green-500',
        'Yellow': 'bg-yellow-400',
        'Black': 'bg-black',
        'White': 'bg-white border',
        'Orange': 'bg-orange-500',
        'Purple': 'bg-purple-500',
        'Pink': 'bg-pink-500',
        'Brown': 'bg-amber-800',
        'Gray': 'bg-gray-500',
        'Silver': 'bg-gray-300',
        'Gold': 'bg-amber-400',
        'Coral': 'bg-orange-300',
        'Teal': 'bg-teal-500'
      };
      
      const bgClass = colorMap[color] || 'bg-gray-200';
      
      return (
        <motion.div 
          key={index}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${bgClass} h-6 w-12 rounded-full inline-block mr-1`}
          title={color}
        />
      );
    });
  };
  
  return (
    <div className="space-y-6">
      {/* Game Status Banner */}
      <AnimatePresence>
        {gameState.gameStatus !== 'playing' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-6 rounded-lg shadow-md text-center ${
              gameState.gameStatus === 'won' 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white' 
                : 'bg-gradient-to-r from-red-400 to-rose-500 text-white'
            }`}
          >
            <h2 className="text-2xl font-bold mb-2">
              {gameState.gameStatus === 'won' ? (
                <span className="flex items-center justify-center">
                  <Trophy className="h-7 w-7 mr-2" /> You Won!
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <AlertCircle className="h-7 w-7 mr-2" /> Game Over
                </span>
              )}
            </h2>
            <p className="text-lg mb-2">
              The company was <strong>{gameState.currentCompany?.name}</strong>
            </p>
            <p className="text-sm mb-4 opacity-90">
              {gameState.gameStatus === 'won' 
                ? `You guessed it in ${gameState.guesses.length} ${gameState.guesses.length === 1 ? 'try' : 'tries'}!` 
                : 'Better luck next time!'}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={handlePlayAgain} 
                className="bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Play Again
              </Button>
              <Button 
                asChild
                variant="outline" 
                className="bg-transparent border-white text-white hover:bg-white/20"
              >
                <a 
                  href={`https://twitter.com/intent/tweet?text=I ${gameState.gameStatus === 'won' ? 'guessed' : 'played'} Corpdle today! The company was ${gameState.currentCompany?.name}. Play at corpdle.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Share Result
                </a>
              </Button>
            </div>
            <div className="mt-4 text-sm flex items-center justify-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Next Corpdle: {timeLeft}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hints Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-amber-400" /> Hints
        </h2>
        
        {gameState.revealedHints.length === 0 ? (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6 text-muted-foreground flex items-center justify-center"
          >
            <Zap className="h-5 w-5 mr-2 text-amber-400" />
            Make your first guess to reveal the initial hint!
          </motion.p>
        ) : (
          <div className="grid gap-4">
            {gameState.revealedHints.map((hintType, index) => {
              // Get the actual value from the company object
              const hintValue = gameState.currentCompany ? gameState.currentCompany[hintType as keyof typeof gameState.currentCompany] : null;
              
              return (
                <motion.div 
                  key={hintType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-indigo-100 dark:border-indigo-900"
                >
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 block mb-1">
                    {HINT_LABELS[hintType]}
                  </span>
                  {hintType === 'colors' && hintValue ? (
                    <div className="flex items-center gap-1 mt-2">
                      {renderColorPills(hintValue as string)}
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {hintValue as string}
                      </span>
                    </div>
                  ) : (
                    <span className="font-medium block text-lg">
                      {hintValue as string}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
      
      {/* Guesses Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-blue-900"
      >
        <h2 className="text-xl font-semibold mb-4">Your Guesses</h2>
        
        <div className="space-y-2 mb-4">
          {gameState.guesses.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-muted-foreground text-center py-6 italic"
            >
              No guesses yet. Enter your first guess below.
            </motion.p>
          ) : (
            <div className="grid gap-3">
              {gameState.guesses.map((guess, index) => {
                const isCorrect = gameState.currentCompany && 
                  guess.toLowerCase() === gameState.currentCompany.name.toLowerCase();
                
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className={`p-4 rounded-lg flex items-center justify-between ${
                      isCorrect
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 border border-green-200 dark:border-green-800' 
                        : 'bg-gradient-to-r from-red-100 to-rose-100 dark:from-red-900/40 dark:to-rose-900/40 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-5 w-5 mr-2 text-red-600 dark:text-red-400" />
                      )}
                      <span className="font-medium text-lg">{guess}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                        Guess #{index + 1}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
        
        {gameState.gameStatus === 'playing' ? (
          <form onSubmit={handleGuessSubmit} className="space-y-2">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={guessInput}
                onChange={(e) => setGuessInput(e.target.value)}
                placeholder="Enter company name..."
                className="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isSubmitting}
              />
              <Button 
                type="submit" 
                className="h-12 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </motion.div>
                ) : (
                  "Guess"
                )}
              </Button>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-between items-center text-sm text-muted-foreground mt-3 px-1"
            >
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-amber-400" />
                <span>Wrong guess = New hint</span>
              </div>
              <div>
                {gameState.maxGuesses - gameState.guesses.length} guesses remaining
              </div>
            </motion.div>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-primary/10 border text-center"
          >
            <h3 className="font-medium">
              {gameState.gameStatus === 'won' ? 'Congratulations!' : 'Game Over!'}
            </h3>
            <p className="text-sm mt-1">
              The company was <strong>{gameState.currentCompany?.name}</strong>
            </p>
          </motion.div>
        )}
      </motion.div>
      
      {/* Game Controls */}
      {gameState.gameStatus === 'playing' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-between"
        >
          <Button 
            variant="outline" 
            onClick={handlePlayAgain} 
            className="border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 shadow-sm"
          >
            <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
            New Company
          </Button>
          <Button 
            variant="outline" 
            onClick={handleGiveUp} 
            className="text-destructive border-destructive/30 hover:bg-destructive/10 shadow-sm"
          >
            Give Up
          </Button>
        </motion.div>
      )}
      
      {/* Answer Reveal */}
      <AnimatePresence>
        {(showAnswer || gameState.gameStatus !== 'playing') && gameState.currentCompany && (
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-amber-900 mt-6"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-amber-500" />
              Company Details
            </h2>
            <div className="grid gap-3">
              {Object.entries(HINT_LABELS).map(([key, label], index) => {
                // Get the company property value, ensuring it's not undefined
                const value = gameState.currentCompany?.[key as keyof typeof gameState.currentCompany];
                
                return (
                  <motion.div 
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                  >
                    <span className="text-sm font-medium text-amber-600 dark:text-amber-400 block mb-1">{label}</span>
                    {key === 'colors' ? (
                      <div className="flex items-center gap-1 mt-2">
                        {renderColorPills(value as string)}
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                          {value as string}
                        </span>
                      </div>
                    ) : (
                      <span className="font-medium text-lg">
                        {value as string}
                      </span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GameBoard;