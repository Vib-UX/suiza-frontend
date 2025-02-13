/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useQuery } from '@tanstack/react-query';
// import { useEffect, } from 'react';

// import { fetchUserData, useFitbitAuth } from '../hooks/useFitbitAuth';
import { generateCodeChallenge, generateCodeVerifier } from '../lib/helper';
// import useGlobalStorage from '../store';
import { Transaction } from '@mysten/sui/transactions';
import { useWallet } from '@suiet/wallet-kit';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Vr, Watch } from '../../public';
import { SUI_CONTRACT, toastStyles } from '../config';
import { fetchUserData, useFitbitAuth } from '../hooks/useFitbitAuth';
import useGlobalStorage from '../store';
import { client } from './walletConnect';
import MyModal from './ui/modal';

const ConnectGears = () => {
    const wallet = useWallet();
    useFitbitAuth();
    const sessionCode = sessionStorage.getItem('fitbit_token');
    const [recordLink, setRecordLink] = useState('');
    const [bluetoothPaired, setBluetoothPaired] = useState(false);
    const [trxModal, setTrxModal] = useState(false);
    const { userInfo, setUserInfo, setActiveStep } = useGlobalStorage();
    const { data } = useQuery({
        queryKey: ['user-data'],
        queryFn: () => fetchUserData(sessionCode!),
        enabled: !!sessionCode,
    });

    const sendCall = async (resp: string) => {
        try {
            const contractModule = 'health';
            const contractMethod = 'create_health_profile';
            const tx = new Transaction();
            tx.setGasBudget(100000000);
            tx.moveCall({
                target: `${SUI_CONTRACT}::${contractModule}::${contractMethod}`,
                arguments: [tx.pure.string(resp), tx.pure.u8(5)],
            });
            const result = await wallet.signAndExecuteTransaction({
                transaction: tx,
            });
            const res = await client.waitForTransaction({
                digest: result.digest,
            });
            return res.digest;
        } catch {}
    };
    const onChainPush = async () => {
        const res = await sendCall(
            '21203566200152448597169171475121561620893492467321985039912602014681180776226'
        );
        if (res) {
            setTrxModal(true);
            setRecordLink(res);
        }
    };
    useEffect(() => {
        if (data) {
            setUserInfo({
                ...userInfo,
                twitterUsername: localStorage.getItem('twitter_username'),
                name: data.fullName,
                age: data.age,
                weight: data.weight,
                height: data.height,
                gender: data.gender,
            });
            onChainPush();
        }
    }, [data]);
    const handleGetFitRedirection = async () => {
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        sessionStorage.setItem('code_verifier', verifier);
        window.location.href = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23Q7RW&scope=activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=${challenge}&code_challenge_method=S256`;
    };
    const requestBluetoothPermission = async () => {
        try {
            const device = await (navigator as any).bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: ['battery_service'],
            });

            toast.success(`Connected to: ${device.name}`, toastStyles);
            setBluetoothPaired(true);
        } catch (error: any) {
            setBluetoothPaired(false);
            toast.error('Bluetooth connection failed:', toastStyles);
        }
    };

    return (
        <>
            {trxModal && (
                <MyModal
                    isOpen={trxModal}
                    recordLink={recordLink}
                    setIsOpen={setTrxModal}
                    setActiveStep={setActiveStep}
                />
            )}
            <div className="border border-[#79DFED] p-6 rounded-xl    bg-gradient-to-br from-[#4DA2FF]/30 via-[#0a0f1b] to-[#0e1525] h-full w-full md:size-[400px] mx-4 md:ml-20 text-center md:text-left">
                <div className="bg-[radial-gradient(circle,_#FFFFFF_0%,_#FF5800_100%)] bg-clip-text text-transparent uppercase text-lg md:text-xl">
                    ar gear
                </div>
                <p className="text-lg py-3 md:py-5">
                    Immerse yourself in AI-powered virtual experiences and
                    productivity tools.
                </p>
                <button
                    disabled={bluetoothPaired}
                    className="border border-[#FF5800] p-2 rounded-lg w-full md:w-auto"
                    onClick={requestBluetoothPermission}
                >
                    {bluetoothPaired ? 'Connected' : 'Connect Now'}
                </button>

                <img
                    src={Vr}
                    alt="VR Gear"
                    height={150}
                    width={150}
                    className="mx-auto mt-10 md:mt-16"
                />
            </div>
            {/* Smartwatch */}
            <div className="border border-[#79DFED] p-6 rounded-xl    bg-gradient-to-br from-[#4DA2FF]/30 via-[#0a0f1b] to-[#0e1525] h-full w-full md:size-[400px] mx-4 md:ml-20 text-center md:text-left">
                <div className="bg-[radial-gradient(circle,_#FFFFFF_0%,_#FF5800_100%)] bg-clip-text text-transparent uppercase text-lg md:text-xl">
                    smartwatch
                </div>
                <p className="text-lg py-3 md:py-5">
                    Track your fitness, heart rate, and activity in real-time.
                </p>
                <button
                    className="border border-[#FF5800] p-2 rounded-lg w-full md:w-auto cursor-pointer"
                    onClick={handleGetFitRedirection}
                >
                    Connect Now
                </button>
                <img
                    src={Watch}
                    alt="Smartwatch"
                    height={150}
                    width={150}
                    className="mx-auto mt-10"
                />
            </div>

            <div
                onClick={() => setActiveStep(2)}
                className="mt-auto cursor-pointer underline flex items-center gap-x-2"
            >
                Next{' '}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
            </div>
        </>
    );
};

export default ConnectGears;
