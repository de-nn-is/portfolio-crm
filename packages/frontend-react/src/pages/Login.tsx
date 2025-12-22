import { useState, FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { LOGIN_MUTATION } from '../graphql/queries';
import { ThemeToggle } from '../components/ui/ThemeToggle';
import { LanguageSwitcher } from '../components/ui/LanguageSwitcher';

export const Login = () => {
  const { t } = useTranslation();
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
      setError(err.message || t('auth.loginError'));
    }
  };

  return (
    <div className="min-h-screen bg-surface-primary flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <div className="bg-surface-secondary rounded-lg shadow-lg p-8 border border-border">
          <h1 className="text-3xl font-bold text-primary text-center mb-2">
            Portfolio CRM
          </h1>
          <p className="text-text-secondary text-center mb-8">
            {t('auth.loginTitle')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t('auth.username')}
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-surface-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-primary mb-2"
              >
                {t('auth.password')}
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-surface-primary text-text-primary border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-error/10 border border-error text-error text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? t('common.loading') : t('auth.login')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Demo: admin / admin
          </p>
        </div>
      </div>
    </div>
  );
};
