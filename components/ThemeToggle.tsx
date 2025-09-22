'use client';

import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export const ThemeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // only true on client
  }, []);

  if (!mounted) {
    // Prevents hydration mismatch by not rendering theme-dependent UI on server
    return null;
  }

  const activeTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div className="flex flex-row items-center gap-2 border rounded-3xl p-2 border-gray-500 bg-gray-50 dark:bg-gray-700">
      {/* Light mode */}
      <button title="Light Mode" onClick={() => setTheme('light')}>
        <Sun className={cn('size-5', activeTheme === 'light' && 'text-yellow-400')} />
      </button>

      {/* System / Device mode */}
      <button title="Device Mode" onClick={() => setTheme('system')}>
        <Monitor className={cn('size-5', theme === 'system' && 'text-blue-500')} />
      </button>

      {/* Dark mode */}
      <button title="Dark Mode" onClick={() => setTheme('dark')}>
        <Moon className={cn('size-5', activeTheme === 'dark' && 'text-purple-500')} />
      </button>
    </div>
  );
};
