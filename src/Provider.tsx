import { ReactNode } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
const Provider = ({ children }: { children: ReactNode }) => {
    return <WalletProvider>{children}</WalletProvider>;
};

export default Provider;
