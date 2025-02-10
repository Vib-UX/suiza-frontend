import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { SUI_DEVNET_FAUCET, toastStyles } from '../config';
import useGlobalStorage from '../store';
const rpcUrl = getFullnodeUrl('devnet');
const client = new SuiClient({ url: rpcUrl });
import axios from 'axios';

const WalletConnect = () => {
    const wallet = useWallet();
    const { setActiveStep } = useGlobalStorage();
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
                    setActiveStep(3);
                }
                return coinBalanceData;
            }
            return null;
        },
    });
    return (
        <div className="border border-[#79DFED] p-6 rounded-xl    bg-gradient-to-br from-[#4DA2FF]/30 via-[#0a0f1b] to-[#0e1525] h-full w-full md:size-[400px] mx-4 md:ml-20 text-center md:text-left">
            <div className="bg-[radial-gradient(circle,_#FFFFFF_0%,_#FF5800_100%)] bg-clip-text text-transparent uppercase text-lg md:text-xl">
                connect wallet
            </div>
            <p className="text-lg py-3 md:py-5">
                Securely store your fitness data and transactions on the
                blockchain.
            </p>
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
                    <button className="border border-[#FF5800] p-2 rounded-lg w-full md:w-auto">
                        Connect wallet
                    </button>
                }
            />
        </div>
    );
};

export default WalletConnect;