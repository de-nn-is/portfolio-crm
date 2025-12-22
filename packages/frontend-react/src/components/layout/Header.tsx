import { useAuth } from '../../contexts/AuthContext';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

export const Header = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-surface-secondary border-b border-border flex items-center justify-between px-6">
      <div className="flex-1" />

      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        <ThemeToggle />
        
        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
            {user?.username.charAt(0).toUpperCase()}
          </div>
          <span className="text-text-primary font-medium">{user?.username}</span>
        </div>
      </div>
    </header>
  );
};
