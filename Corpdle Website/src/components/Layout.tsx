
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { ThemeProvider } from './theme-provider';

const Layout = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="corpdle-theme">
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <footer className="py-4 text-center text-sm text-muted-foreground border-t">
          <p>© {new Date().getFullYear()} Corpdle - A company guessing game</p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

export default Layout;