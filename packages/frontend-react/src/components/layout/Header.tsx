import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-800/30 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 flex items-center justify-between px-6 transition-colors duration-300">
      <div className="flex-1" />

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
        
        <div className="flex items-center gap-3 pl-4 ml-2 border-l border-gray-200/50 dark:border-white/10">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-800 dark:text-white font-medium">{user?.username}</span>
        </div>
      </div>
    </header>
  );
};
