import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { SUI_CONTRACT, SUI_DEVNET_FAUCET, toastStyles } from '../config';
import { Transaction } from '@mysten/sui/transactions';
import useGlobalStorage from '../store';
const rpcUrl = getFullnodeUrl('devnet');
export const client = new SuiClient({ url: rpcUrl });

const WalletConnect = () => {
    const wallet = useWallet();
    const { userInfo, setUserInfo } = useGlobalStorage();
    const handleLaunchAgent = async () => {
        try {
            const contractModule = 'Streak_profile';
            const contractMethod = 'create_profile';
            const tx = new Transaction();
            tx.setGasBudget(100000000);
            tx.moveCall({
                target: `${SUI_CONTRACT}::${contractModule}::${contractMethod}`,
                arguments: [
                    tx.object(
                        '0x0000000000000000000000000000000000000000000000000000000000000006'
                    ),
                ],
            });

            const result = await wallet.signAndExecuteTransaction({
                transaction: tx,
            });

            const res = await client.waitForTransaction({
                digest: result.digest,
                options: { showEffects: true },
            });
            localStorage.setItem('profile', 'true');
            const createdObjects = res.effects?.created || [];
            if (createdObjects.length > 0) {
                const userProfileId = createdObjects[0].reference.objectId;
                return userProfileId;
            } else {
                return null;
            }
        } catch (err) {
            toast.error('Something went wrong', toastStyles);
            console.log(err);
        }
    };
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
                    const res = await handleLaunchAgent();
                    setUserInfo({
                        ...userInfo,
                        objectId: res,
                    });
                } else if (
                    !localStorage.getItem('profile') &&
                    wallet.account.address
                ) {
                    const res = await handleLaunchAgent();
                    setUserInfo({
                        ...userInfo,
                        objectId: res,
                    });
                }
                return coinBalanceData;
            }
            return null;
        },
    });
    return (
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
                <button className="cursor-pointer border border-[#FF5800] p-2 rounded-lg w-full md:w-auto">
                    Connect wallet
                </button>
            }
        />
    );
};

export default WalletConnect;
