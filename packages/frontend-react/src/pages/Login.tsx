import { useState, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { LOGIN_MUTATION } from '../graphql/queries';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export const Login = () => {
  const { t } = useTranslation(['auth', 'common']);
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await loginMutation({
        variables: {
          input: { username, password },
        },
      });

      if (data?.login) {
        login(data.login.token, data.login.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || t('loginError', { ns: 'auth' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-black dark:via-purple-950 dark:to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      
      {/* Neon glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-slate-800/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-cyan-500/20 dark:border-purple-500/20 relative overflow-hidden">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-2xl"></div>
          
          <div className="relative z-10">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent text-center mb-2">
            Portfolio CRM
          </h1>
          <p className="text-slate-300 dark:text-slate-400 text-center mb-8">
            {t('loginTitle', { ns: 'auth' })}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-slate-200 dark:text-slate-300 mb-2"
              >
                {t('username', { ns: 'auth' })}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 dark:bg-black/50 text-white border border-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200 dark:text-slate-300 mb-2"
              >
                {t('password', { ns: 'auth' })}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-slate-900/50 dark:bg-black/50 text-white border border-slate-700 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/50 text-red-300 text-sm backdrop-blur-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium hover:from-cyan-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70"
            >
              {loading ? t('loading', { ns: 'common' }) : t('login', { ns: 'auth' })}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400 dark:text-slate-500">
            Demo: admin / admin
          </p>
          </div>
        </div>
      </div>
    </div>
  );
};
