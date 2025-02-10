
import useGlobalStorage from '../store';
import { useRef, useState } from 'react';
import { Confetti, ConfettiRef } from './ui/confeti';
import toast from 'react-hot-toast';
import { toastStyles } from '../config';
import { useNavigate } from 'react-router-dom';
import PulsatingDots from './ui/loaders';

const Launcher = () => {
    const { userInfo } = useGlobalStorage();
    const [loader, setLoader] = useState(false);
    const navigate = useNavigate();
    const confettiRef = useRef<ConfettiRef>(null);

    const handleCreateAgent = async () => {
        setLoader(true);
        try {
            const res = await fetch(
                'https://6836-2405-201-4024-580a-25d3-fec3-556f-ce2f.ngrok-free.app/create-character',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userInfo),
                }
            );
            const resp = await res.json();
            console.log(resp);
            if (resp) {
                const res = await fetch(
                    'https://sui-eliza-production.up.railway.app/api/knowledge-base/add',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(resp.character),
                    }
                );
                const data = await res.json();
                console.log(data);
                localStorage.setItem('dynamicId', data.name);
                navigate('/YourAgent')
                setLoader(false);

            }
        } catch (err) {
            setLoader(false);
            toast.error('Failed to deploy agent', toastStyles);
        }
    };
    return (
        <div
            onClick={handleCreateAgent}
            className="relative px-20 flex h-[150px] ml-44 flex-col items-center justify-center overflow-hidden rounded-lg border "
        >
            <div className="flex items-center">
                <span className="underline cursor-pointer text-center font-semibold leading-none">
                    Ready to roll your customized agent
                </span>
                {loader && <PulsatingDots />}
            </div>

            <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-0 size-full"
                onMouseEnter={() => {
                    confettiRef.current?.fire({});
                }}
            />
        </div>
    );
};

export default Launcher;