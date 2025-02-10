/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useQuery } from '@tanstack/react-query';
// import { useEffect, } from 'react';

// import { fetchUserData, useFitbitAuth } from '../hooks/useFitbitAuth';
import { generateCodeChallenge, generateCodeVerifier, generateCommitment } from '../lib/helper';
// import useGlobalStorage from '../store';
import toast from 'react-hot-toast';
import { Transaction } from '@mysten/sui/transactions'
import { toastStyles } from '../config';
import { useEffect, useState } from 'react';
import { Vr, Watch } from '../../public';
import { fetchUserData, useFitbitAuth } from '../hooks/useFitbitAuth';
import useGlobalStorage from '../store';
import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@suiet/wallet-kit';
import { client } from './walletConnect';

const ConnectGears = () => {
    const wallet = useWallet();
    useFitbitAuth();
    const sessionCode = sessionStorage.getItem('fitbit_token');
    const [bluetoothPaired, setBluetoothPaired] = useState(false);
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
                target: `0x3b9ba93b293870b831443b6435712f28a2bccf75cb37a6e316b69f5e48dce531::${contractModule}::${contractMethod}`,
                arguments: [
                    tx.pure.string(resp),
                    tx.pure.u8(8),
                    tx.object('0x6'),
                ],
            });
            const result = await wallet.signAndExecuteTransaction({
                transaction: tx,
            });
            const res = await client.waitForTransaction({
                digest: result.digest,
            });

            return res;
        } catch (err) {
            toast.error("Error signing transaction", toastStyles)
        }
    };
    const onChainPush = async ({
        height,
        weight,
        age,
    }: {
        height: number;
        weight: number;
        age: number;
    }) => {
        const resp = await generateCommitment({
            blood_pressure: 120,
            heart_rate: 75,
            temperature: 37,
            oxygen: 98,
            respiratory_rate: 16,
            height: height,
            weight: weight,
            age: age,
        });
        console.log(resp);
        const res = await sendCall(resp);
        if (res) {
            toast.success("Data stored on chain successfully", toastStyles)
            setActiveStep(2)
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
            onChainPush({
                height: data.height,
                weight: data.weight,
                age: data.age,
            });
        }
    }, [data]);
    const handleGetFitRedirection = async () => {
        const verifier = generateCodeVerifier();
        const challenge = await generateCodeChallenge(verifier);
        sessionStorage.setItem('code_verifier', verifier);
        window.location.href = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23Q778&scope=activity+cardio_fitness+electrocardiogram+heartrate+irregular_rhythm_notifications+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&code_challenge=${challenge}&code_challenge_method=S256`;
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

        </>
    );
};

export default ConnectGears;
