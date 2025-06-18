
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getGameStats } from '@/lib/game';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  Trophy, 
  Building2, 
  Flame, 
  Award, 
  BarChart 
} from 'lucide-react';

const Stats = () => {
  const [stats, setStats] = useState({
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
  });
  
  useEffect(() => {
    const gameStats = getGameStats();
    setStats(gameStats);
  }, []);
  
  const winPercentage = stats.played > 0 
    ? Math.round((stats.won / stats.played) * 100) 
    : 0;
  
  const maxDistribution = Math.max(...Object.values(stats.guessDistribution), 1);
  
  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block"
      >
        Your Statistics
      </motion.h1>
      
      {stats.played === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-900 mb-6"
        >
          <Building2 className="h-16 w-16 mx-auto mb-4 text-blue-500 opacity-70" />
          <h2 className="text-2xl font-semibold mb-3">No Games Played Yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Play your first game to start tracking your statistics. Each game will contribute to your performance metrics.
          </p>
          <Button asChild className="px-8 py-6 h-auto text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
            <Link to="/" className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Play Now
            </Link>
          </Button>
        </motion.div>
      ) : (
        <>
          {/* Summary Stats */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-xl border border-blue-100 dark:border-blue-900 text-center">
              <Building2 className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-3xl font-bold text-blue-700 dark:text-blue-400">{stats.played}</div>
              <div className="text-sm text-blue-600 dark:text-blue-500 font-medium">Played</div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-xl border border-green-100 dark:border-green-900 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-green-500" />
              <div className="text-3xl font-bold text-green-700 dark:text-green-400">{winPercentage}%</div>
              <div className="text-sm text-green-600 dark:text-green-500 font-medium">Win Rate</div>
            </div>
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-6 rounded-xl border border-amber-100 dark:border-amber-900 text-center">
              <Flame className="h-6 w-6 mx-auto mb-2 text-amber-500" />
              <div className="text-3xl font-bold text-amber-700 dark:text-amber-400">{stats.currentStreak}</div>
              <div className="text-sm text-amber-600 dark:text-amber-500 font-medium">Current Streak</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-xl border border-purple-100 dark:border-purple-900 text-center">
              <Award className="h-6 w-6 mx-auto mb-2 text-purple-500" />
              <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">{stats.maxStreak}</div>
              <div className="text-sm text-purple-600 dark:text-purple-500 font-medium">Max Streak</div>
            </div>
          </motion.div>
          
          {/* Guess Distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 p-6 rounded-xl border border-cyan-100 dark:border-cyan-900 mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-cyan-500" />
              Guess Distribution
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.guessDistribution).map(([guess, count]) => (
                <div key={guess} className="flex items-center">
                  <div className="w-6 mr-3 font-medium text-cyan-700 dark:text-cyan-400">{guess}</div>
                  <div className="flex-1 h-10 flex items-center">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxDistribution) * 100}%` }}
                      transition={{ delay: 0.1 * Number(guess), duration: 0.5 }}
                      className={`h-full flex items-center justify-end px-3 rounded-md text-primary-foreground ${
                        count > 0 
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500' 
                          : 'bg-muted'
                      }`}
                      style={{ minWidth: count > 0 ? '2.5rem' : '0' }}
                    >
                      {count > 0 && count}
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-center"
      >
        <Button asChild className="px-8 py-6 h-auto text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Play Again
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default Stats;