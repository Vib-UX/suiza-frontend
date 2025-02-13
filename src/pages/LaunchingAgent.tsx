import { Link } from 'react-router-dom';
import ConnectGears from '../components/connectGears';
import ConnectSocials from '../components/connectSocials';

import Navbar from '../components/navbar';
import VerticalLinearStepper from '../components/ui/stepper';
import useGlobalStorage from '../store';
import Launcher from '../components/launcher';

const LaunchAgent = () => {
    const { activeStep, setActiveStep, userInfo, setUserInfo } =
        useGlobalStorage();

    return (
        <div
            className="relative bg-[#0a0f1b]       text-white

font-chakra min-h-screen flex flex-col items-center px-4 md:px-8"
        >
            <Navbar />
            <div className="mt-44 w-full">
                <div className="text-4xl  font-bold text-center">
                    Launch your Agent
                </div>

                <div className="text-center text-sm md:text-2xl font-semibold opacity-90 pt-5 md:pt-20 text-white">
                    {activeStep === 0
                        ? 'Connect Your Socials – Stay Synced with Suiza'
                        : activeStep === 1
                        ? 'Connect Your Gears – Immerse Yourself in AI-powered Virtual Experiences'
                        : activeStep === 2
                        ? 'Agent Configuration'
                        : 'Launch Your Agent'}
                </div>
                <p className="text-lg  opacity-50 leading-loose py-5 text-center">
                    Enhance Suiza’s AI capabilities by linking your favorite
                    platforms for smarter recommendations,
                    <br /> seamless scheduling, and a truly personalized
                    experience.
                </p>
                <Link to={'/your-agent'} className="text-white" />
            </div>
            <div className="flex flex-col md:flex-row items-center py-10  mx-auto container gap-6 md:gap-x-6">
                <VerticalLinearStepper />
                {activeStep === 0 ? (
                    <ConnectSocials />
                ) : activeStep === 1 ? (
                    <ConnectGears />
                ) : activeStep === 2 ? (
                    <>
                        <div className="mx-auto border border-[#79DFED] p-6 rounded-md w-xl text-center">
                            <div className="flex items-center gap-x-4">
                                <div>Browser Use Url </div>
                                <input
                                    value={userInfo.browserUseUrl}
                                    onChange={(e) => {
                                        setUserInfo({
                                            ...userInfo,
                                            browserUseUrl: e.target.value,
                                        });
                                    }}
                                    className="border focus:outline-none rounded-md py-1 px-2 my-5 w-full"
                                />
                            </div>
                            <div className="flex items-center gap-x-4">
                                <div>Agent Wallet Key </div>
                                <input
                                    type="password"
                                    value={userInfo.agentWalletKey}
                                    onChange={(e) => {
                                        setUserInfo({
                                            ...userInfo,
                                            agentWalletKey: e.target.value,
                                        });
                                    }}
                                    className="border focus:outline-none rounded-md py-1 px-2 my-5 w-full"
                                />
                            </div>
                            <button
                                disabled={
                                    userInfo.browserUseUrl &&
                                    userInfo.agentWalletKey
                                        ? false
                                        : true
                                }
                                className="bg-[#79DFED] w-fit ml-auto rounded-md px-2 py-1 text-black cursor-pointer disabled:cursor-not-allowed"
                                onClick={() => {
                                    setActiveStep(3);
                                }}
                            >
                                Submit
                            </button>
                        </div>
                        <div
                            onClick={() => setActiveStep(3)}
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
                ) : (
                    <Launcher />
                )}
            </div>
        </div>
    );
};

export default LaunchAgent;
