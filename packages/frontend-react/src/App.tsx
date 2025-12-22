import { ApolloProvider } from '@apollo/client';
import { RouterProvider } from 'react-router-dom';
import { apolloClient } from './lib/apollo';
import { router } from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './i18n';

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <ThemeProvider>
          <RouterProvider router={router} />
        </ThemeProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
