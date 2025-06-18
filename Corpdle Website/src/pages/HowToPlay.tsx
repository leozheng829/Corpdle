
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Building2, 
  Lightbulb, 
  Target, 
  ListChecks, 
  RefreshCw,
  BarChart2
} from 'lucide-react';
import { COMPANIES } from '@/lib/game';

const HowToPlay = () => {
  return (
    <div className="max-w-2xl mx-auto">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 inline-block"
      >
        How to Play Corpdle
      </motion.h1>
      
      <div className="space-y-8 mb-8">
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-blue-900"
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <Target className="h-5 w-5 mr-2 text-blue-500" />
            Game Objective
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Corpdle is a fun guessing game where you try to identify a major company based on hints.
            You have 6 attempts to guess the correct company, with each wrong guess revealing a new hint!
            With {COMPANIES.length} different companies to discover, each game offers a new challenge.
          </p>
        </motion.section>
        
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl p-6 shadow-sm border border-purple-100 dark:border-purple-900"
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <ListChecks className="h-5 w-5 mr-2 text-purple-500" />
            How to Play
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>A company is randomly selected for you to guess.</li>
            <li>You start with the "Annual Revenue" hint already revealed.</li>
            <li>Type your guess in the input field and click "Guess" or press Enter.</li>
            <li>If your guess is incorrect, a new hint will be automatically revealed!</li>
            <li>If your guess is correct, it will be marked in green and you win!</li>
            <li>You have a maximum of 6 guesses to identify the company.</li>
            <li>The game ends when you guess correctly or use all your guesses.</li>
            <li>Use the "New Company" button to start a fresh game with a different company anytime!</li>
          </ol>
        </motion.section>
        
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-amber-900"
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <Lightbulb className="h-5 w-5 mr-2 text-amber-500" />
            Hints
          </h2>
          <p className="mb-3 text-gray-700 dark:text-gray-300">
            You start with the first hint, and additional hints are revealed in this specific order after each wrong guess:
          </p>
          <div className="grid gap-3">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="font-medium">1. Annual Revenue</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">The company's yearly revenue</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="font-medium">2. Headquarters</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">Where the company is based</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="font-medium">3. Industry</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">The business sector the company operates in</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="font-medium">4. CEO</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">The current chief executive officer</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="font-medium">5. Brand Colors</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">The company's signature colors</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span className="font-medium">6. Slogan/Motto</span>
              <p className="text-sm text-gray-600 dark:text-gray-400">A well-known company slogan</p>
            </div>
          </div>
        </motion.section>
        
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl p-6 shadow-sm border border-green-100 dark:border-green-900"
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-green-500" />
            Play Again Feature
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Don't want to wait for tomorrow? Use the "New Company" or "Play Again" button to immediately 
            start a fresh game with a different company from our database of {COMPANIES.length} major corporations!
            Each new game selects a random company, giving you endless opportunities to test your knowledge.
          </p>
        </motion.section>
        
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/30 dark:to-sky-950/30 rounded-xl p-6 shadow-sm border border-cyan-100 dark:border-cyan-900"
        >
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <BarChart2 className="h-5 w-5 mr-2 text-cyan-500" />
            Statistics
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Your game statistics are tracked, including games played, win percentage, and current streak.
            Visit the Statistics page to view your performance and see how you compare over time.
          </p>
        </motion.section>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex justify-center"
      >
        <Button asChild className="px-8 py-6 h-auto text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Start Playing
          </Link>
        </Button>
      </motion.div>
    </div>
  );
};

export default HowToPlay;
