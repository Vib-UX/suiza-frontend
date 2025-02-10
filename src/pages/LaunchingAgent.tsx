import { Link } from 'react-router-dom';
import ConnectGears from '../components/connectGears';
import ConnectSocials from '../components/connectSocials';


import Navbar from '../components/navbar';
import VerticalLinearStepper from '../components/ui/stepper';
import useGlobalStorage from '../store';

const LaunchAgent = () => {
    const { activeStep } = useGlobalStorage();

    return (
        <div className="relative bg-[#0a0f1b]       text-white

font-chakra min-h-screen flex flex-col items-center px-4 md:px-8">
            <Navbar />
            <div className="mt-36">
                <div className="text-3xl md:text-3xl font-bold text-center">
                    Launch your Agent
                </div>

                <div className="text-center text-sm md:text-2xl font-semibold pt-5 md:pt-20 text-white">
                    Connect Your Socials – Stay Synced with Suiza
                </div>
                <p className="text-lg max-w-[90] leading-loose py-5 text-center">
                    Enhance Suiza’s AI capabilities by linking your favorite
                    platforms for smarter recommendations, seamless scheduling,
                    and a truly personalized experience.
                </p>
                <Link to={'/YourAgent'} className='text-white' />
            </div>
            <div className="flex flex-col md:flex-row items-center py-10  mx-auto container gap-6 md:gap-x-6">
                <VerticalLinearStepper />
                {activeStep === 0 ? (
                    <ConnectSocials />
                ) : activeStep === 1 ? (
                    <ConnectGears />
                ) : null}
            </div>

        </div>

    );
};

export default LaunchAgent;
