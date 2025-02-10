import React, { useState, useEffect } from "react";
import { featureCardImage1, featureCardImage2, featureCardImage3, homePageCoverImage, homePageImage1, homePageImage2, homePageImage3, logo, } from "../../public/index";
import { Link } from "react-router-dom";
import Navbar from '../components/navbar';
export default function Home() {
    const images = [homePageImage1, homePageImage2, homePageImage3];
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className=" bg-[#0a0f1b]       text-white

font-chakra">

            <Navbar />
            {/* Hero Section */}
            <header className="relative w-full h-screen flex items-center justify-center text-center md:text-left p-10 md:p-20">
                <div className="absolute inset-0">
                    <img src={images[currentImage]} className="w-full h-full object-cover transition-all ease-in-out delay-75" alt="Fitness Hero" />
                    <img src={homePageCoverImage} className="w-[70%] h-full object-cover top-0 absolute" alt="cover" />
                </div>
                <div className="absolute space-y-3  z-50  left-10 max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-bold">SuiZa: The Only Fitness Agent You'll Ever Need</h2>
                    <p className="mt-4  opacity-[80%] ">Unlock the future of fitness with AI-powered coaching, wearable integration, and holographic training. Train smarter, track progress effortlessly, and push your limits with SuiZa.</p>
                    <Link to={'/LaunchAgent'} className=" bg-blue-500  px-6  py-3 rounded-lg hover:bg-blue-700">Launch your Fitness Companion</Link>
                </div>
            </header>

            {/* Features Section */}
            <section id="features" className="text-center mt-20 p-10">
                <h2 className="text-3xl font-bold">What Makes SuiZa Unique?</h2>
                <div className="grid gap-6  md:grid-cols-3 my-10">
                    <FeatureCard
                        image={featureCardImage1}
                        title="Fitness Wearable Integration"
                        description="Sync with smartwatches & VR headsets. Real-time workout analysis & AI-powered recommendations."
                    />
                    <FeatureCard
                        image={featureCardImage2}
                        title="Holographic Eliza Agent"
                        description="Next-gen AI fitness coach that appears in AR/VR-enabled devices Personalized real-time guidance for exercises & form correction"
                    />
                    <FeatureCard
                        image={featureCardImage3}
                        title="AI Companion Profiles"
                        description="Train with AI versions of fitness icons. Each AI coach has its own voice, workout philosophy, and motivation style."
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className="text-center flex items-center justify-between px-10 py-5 bg-[#0e1525]">
                <div className="flex justify-center space-x-4 mb-2">
                    <span className="text-gray-400">© Sui</span>
                    <span className="text-gray-400">ELIZA.OS</span>
                    <span className="text-gray-400">Atoma Network</span>
                </div>
                <div className="flex items-center space-x-4">
                    <img src={logo} className="w-10 h-10 object-cover" alt="logo" />

                    <h1 className="text-xl font-bold">SuiZa</h1>
                </div>
                <p>Made with ❤️ in India</p>
            </footer>
        </div>
    );
}

function FeatureCard({ image, title, description }: { image: string, title: string, description: string }) {
    return (
        <div className="bg-[#1a2338] flex flex-col items-center max-w-2xl   p-4  shadow-lg border border-[#4DA2FF]">
            <img src={image} width={300} height={200} alt={title} className="" />
            <h3 className="text-xl font-bold mt-4">{title}</h3>
            <p className="text-gray-400      mt-2">{description}</p>
        </div>
    );
}
