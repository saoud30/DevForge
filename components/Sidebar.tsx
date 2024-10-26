"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FileText, GitBranch, FileCode, Scale, LucideIcon } from 'lucide-react';

// Define interfaces for our props and nav items
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path: string): void => {
    router.push(path);
    onClose();
  };

  if (!mounted) {
    return null;
  }

  const navItems: NavItem[] = [
    { path: '/', icon: FileText, label: 'README.md' },
    { path: '/gitignore', icon: GitBranch, label: '.gitignore' },
    { path: '/requirements', icon: FileCode, label: 'requirements.txt' },
    { path: '/license', icon: Scale, label: 'LICENSE' },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition duration-200 ease-in-out z-50 w-64 gradient-card border-r border-green-100 dark:border-gray-700`}
      >
        <nav className="h-full flex flex-col p-4">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">DevForge</h2>
          <ul className="space-y-2">
            {navItems.map(({ path, icon: Icon, label }) => (
              <li key={path}>
                <button
                  onClick={() => handleNavigation(path)}
                  className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                    pathname === path
                      ? 'gradient-btn text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="mr-2" size={20} />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;