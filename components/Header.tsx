import Link from 'next/link';
import { Hammer, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import HistoryDrawer from './HistoryDrawer';
import { useEffect, useState } from 'react';

const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <Hammer className="w-8 h-8 text-purple-400" />
    <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-300 text-transparent bg-clip-text">
      DevForge
    </span>
  </Link>
);

export default function Header({ onSidebarToggle }: { onSidebarToggle: () => void }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-b border-purple-500/20 bg-gray-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <div className="flex items-center space-x-4">
          <HistoryDrawer />
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
          >
            {mounted && (
              theme === 'dark' ? (
                <Sun className="w-5 h-5 text-purple-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-400" />
              )
            )}
          </button>
        </div>
      </div>
    </header>
  );
}