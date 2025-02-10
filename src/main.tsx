import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './pages/App.tsx';
import Provider from './Provider.tsx';
import LaunchAgent from './pages/LaunchingAgent.tsx';
import YourAgent from './pages/YourAgent.tsx';
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },

    {
        path: '/launch-your-agent',
        element: <LaunchAgent />,
    },
    {
        path: '/YourAgent',
        element: <YourAgent />,
    },
]);
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Provider>
            <RouterProvider router={router} />
        </Provider>
    </StrictMode>
);
