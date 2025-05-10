import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/index.scss';
import App from './App.tsx';
import { Auth0Provider } from '@auth0/auth0-react';
import theme from './styles/theme.ts';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                scope: 'read:current_user update:current_user_metadata',
            }}
            cacheLocation='localstorage'
        >
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </Auth0Provider>
    </StrictMode>
);
