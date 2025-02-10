import { ReactNode } from 'react';
import { Chain, SuiDevnetChain, WalletProvider } from '@suiet/wallet-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import '@suiet/wallet-kit/style.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
const SupportedChains: Chain[] = [SuiDevnetChain];
const Provider = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <WalletProvider chains={SupportedChains}>
                <GoogleOAuthProvider
                    clientId={"100861024553-uauietp9nfeuq4s1ftq0jc09ithtcosv.apps.googleusercontent.com"}

                >
                    <Toaster position="top-center" reverseOrder={false} />
                    {children}
                </GoogleOAuthProvider>
            </WalletProvider>
        </QueryClientProvider >
    );
};

export default Provider;
