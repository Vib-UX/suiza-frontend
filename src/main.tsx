import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './pages/App.tsx';
import Provider from './Provider.tsx';
import Profile from './pages/profile.tsx';
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/profile',
        element: <Profile />,
    },
]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
