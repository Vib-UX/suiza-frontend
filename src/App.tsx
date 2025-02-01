import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import './App.css';
import viteLogo from '/suiza-meta.png';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { SUI_DEVNET_FAUCET, toastStyles } from './config';
import toast from 'react-hot-toast';
const rpcUrl = getFullnodeUrl('devnet');
const client = new SuiClient({ url: rpcUrl });
function App() {
    const wallet = useWallet();
    useQuery({
        enabled: !!wallet.account,
        queryKey: ['faucet', wallet.account ? wallet.account.address : ''],
        queryFn: async () => {
            if (wallet.account?.address) {
                const coinBalanceData = await client.getBalance({
                    owner: wallet.account?.address,
                });
                if (Number(coinBalanceData.totalBalance) / 1e9 === 0) {
                    toast.loading(
                        'Your Sui token are on the way, please wait a moment...',
                        toastStyles
                    );
                    await axios.post(SUI_DEVNET_FAUCET, {
                        FixedAmountRequest: {
                            recipient: wallet.account.address,
                        },
                    });
                    toast.success('Sui token sent successfully!', toastStyles);
                }
                return coinBalanceData;
            }
            return null;
        },
    });
    return (
        <>
            <div>
                <img src={viteLogo} className="logo" alt="Vite logo" />
            </div>
            <h1>Suiza</h1>
            <ConnectButton
                style={
                    wallet.account
                        ? {
                              color: 'white',
                              width: '100%',
                          }
                        : {
                              backgroundColor: 'transparent',
                              width: '100%',
                          }
                }
                children={
                    <button className="w-full border-zinc-800  bg-transparent hover:bg-zinc-800 hover:text-white text-zinc-300">
                        Connect wallet
                    </button>
                }
            />
        </>
    );
}

export default App;
