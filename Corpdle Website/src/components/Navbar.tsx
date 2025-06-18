
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, HelpCircle, Menu, X, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useState } from 'react';
import { ModeToggle } from './mode-toggle';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Play', icon: <Building2 className="h-4 w-4" /> },
    { path: '/how-to-play', label: 'How to Play', icon: <HelpCircle className="h-4 w-4" /> },
    { path: '/stats', label: 'Statistics', icon: <BarChart2 className="h-4 w-4" /> },
  ];

  return (
    <header className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="text-2xl font-bold flex items-center gap-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            <Building2 className="h-6 w-6 text-blue-500" />
            Corpdle
          </Link>
        </motion.div>
        
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Link
                to={item.path}
                className={`flex items-center gap-1.5 hover:text-primary transition-colors ${
                  location.pathname === item.path 
                    ? 'font-medium text-primary' 
                    : 'text-muted-foreground'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            </motion.div>
          ))}
          <ModeToggle />
        </nav>
        
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-primary">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <div className="flex flex-col gap-6 mt-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 text-lg hover:text-primary transition-colors ${
                    location.pathname === item.path 
                      ? 'font-medium text-primary' 
                      : 'text-muted-foreground'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              <div className="mt-4">
                <ModeToggle />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;