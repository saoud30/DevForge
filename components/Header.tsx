import { Menu, Moon, Sun, Hammer, Shield, Package, Scale } from 'lucide-react';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import HistoryDrawer from './HistoryDrawer';

interface HeaderProps {
  onSidebarToggle: () => void;
}

export default function Header({ onSidebarToggle }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = () => {
    switch (pathname) {
      case '/':
        return <Hammer className="h-8 w-8 text-green-600 dark:text-green-400" />;
      case '/gitignore':
        return <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />;
      case '/requirements':
        return <Package className="h-8 w-8 text-green-600 dark:text-green-400" />;
      case '/license':
        return <Scale className="h-8 w-8 text-green-600 dark:text-green-400" />;
      default:
        return <Hammer className="h-8 w-8 text-green-600 dark:text-green-400" />;
    }
  };

  if (!mounted) {
    return (
      <header className="gradient-header shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">DevForge</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-6 w-6" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="gradient-header shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {getIcon()}
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">DevForge</h1>
        </div>
        <div className="flex items-center space-x-4">
          <HistoryDrawer />
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-gray-700 transition duration-200"
          >
            <Menu size={24} className="text-green-600 dark:text-green-400" />
          </button>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-gray-700 transition duration-200"
          >
            {theme === 'dark' ? (
              <Sun size={24} className="text-green-600 dark:text-green-400" />
            ) : (
              <Moon size={24} className="text-green-600 dark:text-green-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}