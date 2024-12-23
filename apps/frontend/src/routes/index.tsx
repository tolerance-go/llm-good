import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Dashboard, Users, Settings } from './lazy';
import ErrorBoundary from '../components/ErrorBoundary';

const isDev = import.meta.env.MODE === 'development';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <Users />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
], {
  basename: isDev ? '' : '/admin'
});

export default router; 