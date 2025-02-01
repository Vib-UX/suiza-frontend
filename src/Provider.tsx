import { ReactNode } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import '@suiet/wallet-kit/style.css';
const Provider = ({ children }: { children: ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <WalletProvider>
                <Toaster position="top-center" reverseOrder={false} />
                {children}
            </WalletProvider>
        </QueryClientProvider>
    );
};

export default Provider;
