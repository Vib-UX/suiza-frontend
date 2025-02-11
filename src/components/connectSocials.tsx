import { useGoogleLogin } from '@react-oauth/google';

import { GoogleIcon, Xicon } from "../../public/index"

import useGlobalStorage from '../store';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { toastStyles } from '../config';
import WalletConnect from './walletConnect';
import { useWallet } from '@suiet/wallet-kit';
const ConnectSocials = () => {
    const wallet = useWallet();
    const { setActiveStep, userInfo, setUserInfo } = useGlobalStorage();
    const [triggerEffect, setTriggerEffect] = React.useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const login = useGoogleLogin({
        scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/contacts.readonly',
        onSuccess: async (tokenResponse) => {
            const url =
                'https://www.googleapis.com/oauth2/v1/userinfo?alt=json';
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                },
            });
            const data = await res.json();
            if (data) {
                console.log(data);
                localStorage.setItem('googleAuth', tokenResponse.access_token);
                setUserInfo({
                    ...userInfo,
                    name: data.name,
                    picture: data.picture,
                });
                localStorage.setItem('mail', data.email);
                toast.dismiss();
                toast.success('Google connected successfully', toastStyles);
                setTriggerEffect(true);
            }
        },
    });
    React.useEffect(() => {
        const queryCode = searchParams.get('twitter_username');
        if (queryCode) {
            localStorage.setItem('twitter_username', queryCode);
            toast.dismiss();
            toast.success('Twitter connected successfully', toastStyles);
            setTriggerEffect(true);
        }

        navigate(window.location.pathname, { replace: true });
    }, [searchParams]);
    React.useEffect(() => {
        if (
            localStorage.getItem('googleAuth') &&
            localStorage.getItem('twitter_username') &&
            wallet.address
        ) {
            setActiveStep(1);
        }
    }, [triggerEffect]);
    return (
        <>
            <div className="border overflow-hidden border-[#79DFED] rounded-xl h-full w-full md:size-[400px] mx-4 md:ml-20 text-center md:text-left">
                <div className="relative  flex justify-center items-center rounded-2xl shadow-xl
                  bg-gradient-to-br from-[#4DA2FF]/30 via-[#0a0f1b] to-[#0e1525]">
                    <img
                        src={GoogleIcon}
                        alt="google"
                        height={170}
                        width={170}
                        className="mx-auto py-5"
                    />
                </div>
                <div className="bg-[#1A1D25]  p-6 rounded-b-xl">
                    <div className="bg-[radial-gradient(circle,_#FFFFFF_0%,_#FF5800_100%)] bg-clip-text text-transparent uppercase text-lg md:text-xl">
                        google
                    </div>
                    <p className="text-sm py-3 md:py-5">
                        Sync your calendar and preferences for effortless
                        scheduling.
                    </p>
                    <button
                        disabled={
                            localStorage.getItem('googleAuth') ? true : false
                        }
                        className="border border-[#FF5800] p-2 rounded-lg w-full md:w-auto cursor-pointer"
                        onClick={() => login()}
                    >
                        {localStorage.getItem('googleAuth')
                            ? 'Connected'
                            : 'Connect Now'}
                    </button>
                </div>
            </div >
            <div className="border  overflow-hidden  border-[#79DFED] rounded-xl h-full w-full md:size-[400px] mx-4 text-center md:text-left">
                <div className="relative  flex justify-center items-center rounded-2xl shadow-xl
                  bg-gradient-to-br from-[#4DA2FF]/30 via-[#0a0f1b] to-[#0e1525]">
                    <img
                        src={Xicon}
                        alt="twitter"
                        height={190}
                        width={190}
                        className="mx-auto py-5 "
                    />
                </div>
                <div className="bg-[#1A1D25]  p-6 rounded-b-xl">
                    <div className="bg-[radial-gradient(circle,_#FFFFFF_0%,_#FF5800_100%)] bg-clip-text text-transparent uppercase text-lg md:text-xl">
                        X (Twitter)
                    </div>
                    <p className="text-sm py-3 md:py-5">
                        Get AI-curated insights and stay updated with trending
                        topics.
                    </p>
                    {localStorage.getItem('twitter_username') ? (
                        <div className="border  border-[#FF5800] p-2 rounded-lg w-fit  cursor-pointer">
                            Connected
                        </div>
                    ) : (
                        <a
                            href={
                                'https://suiza-x-oauth-production.up.railway.app/auth/twitter'
                            }
                            className="border border-[#FF5800] p-2 rounded-lg w-full md:w-auto cursor-pointer"
                        >
                            Connect Now
                        </a>
                    )}
                </div>
            </div>
            <WalletConnect setTriggerEffect={setTriggerEffect} />
        </>
    );
};

export default ConnectSocials;
