import {
    anatolyProfilePic,
    davidGogginsProfile,
    jeoWicksProfilePic,
    lazazAngeloProfilePic,
    postPic,
    postPic2,
    previousBattle1,
    previousBattle2,
    previousBattle3,
} from '../../public/index';
import ProfileCard from '../components/ui/tokenBattles/ProfileCard';
import ChallengeCard from '../components/ui/tokenBattles/ChallengeCard';
import Navbar from '../components/navbar';
import { useState, useEffect } from 'react';

const challangeList = [
    {
        id: 1,
        subHeading: 'Previous Challenge',
        title: 'Step count showdown',
        description: 'Most steps in a single day',
        image: previousBattle1,
        winner: 'Team Goggins',
        competitionCode: 'SC1234',
    },
    {
        id: 2,
        subHeading: 'Upcoming Challenge',
        title: 'Plank Endurance Challenge',
        description: 'Hold a plank position for the longest Duration',
        image: previousBattle2,
        winner: null,
        competitionCode: 'PE5678',
    },
    {
        id: 3,
        subHeading: 'Upcoming Challenge',
        title: 'Flexibility Showdown Challenge',
        description: 'Perform and hold the most challenging yoga poses',
        image: previousBattle3,
        winner: null,
        competitionCode: 'FS9101',
    },
];

const MoveToEarn = () => {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const storedStreak = localStorage.getItem('streak');
        if (storedStreak) {
            setStreak(parseInt(storedStreak, 10));
        }
    }, []);

    const updateStreak = () => {
        setStreak(prev => {
            const newStreak = prev + 1;
            localStorage.setItem('streak', newStreak.toString());
            return newStreak;
        });
    };

    return (
        <div className='bg-[#0a0f1b]  text-white font-chakra'>
            <Navbar />
            <div className="w-full overflow-hidden mx-auto max-w-7xl pt-32 gap-x-10 flex justify-center rounded-md p-4 ">
                <div className="flex max-w-[60%] gap-y-4 flex-col ">
                    <div className="border-b h-fit bg-black p-10 rounded-md shadow-xl bg-gradient-to-br from-[#4DA2FF]/30 via-[#0a0f1b] to-[#0e1525] border border-[#79DFED]">
                        <ProfileCard
                            name="David Goggins"
                            role="Fitness coach"
                            text="Team Goggins ready for battle! Time to show Team Lazar who is the real boss."
                            image={null}
                            profilePic={davidGogginsProfile}
                        />
                        <ProfileCard
                            className="border rounded-md border-slate-500 p-10"
                            profilePic={lazazAngeloProfilePic}
                            name="Lazar Angelo"
                            role="Fitness coach"
                            text="Squat Warriors: Let's see who can do the most squats within 5 minutes"
                            image={postPic}
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xl">Want to compete in this Challenge?</span>
                            <div className="flex items-center gap-x-4">
                                <button onClick={updateStreak} className="border border-[#4DA2FF] p-2 rounded-lg w-full md:w-auto">
                                    Register Now
                                    <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                                        <div className="relative h-full w-8 bg-white/20" />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="border-b h-fit bg-black p-10 rounded-md shadow-xl bg-gradient-to-br from-[#4DA2FF]/30 via-[#0a0f1b] to-[#0e1525] border border-[#79DFED]">
                        <ProfileCard
                            name="Joe Wicks"
                            role="Fitness coach"
                            text="Team Wicks is ready to crush the Crunches Challenge!"
                            image={null}
                            profilePic={jeoWicksProfilePic}
                        />
                        <ProfileCard
                            className="border rounded-md border-slate-500 p-10"
                            profilePic={anatolyProfilePic}
                            name="Anatoly"
                            role="Fitness coach"
                            text="Crunches Challenge: Let's see who can do the most crunches in 10 minutes!"
                            image={postPic2}
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-xl">Ready to join the Crunches Challenge?</span>
                            <button onClick={updateStreak} className="border border-[#4DA2FF] p-2 rounded-lg w-full md:w-auto">
                                Register Now
                                <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
                                    <div className="relative h-full w-8 bg-white/20" />
                                </div>
                            </button>
                        </div>
                    </div>
                    <div className="text-center mt-4 text-lg font-bold">Your Streak: {streak} days</div>
                </div>
                <div className="flex flex-col max-w-[40%]">
                    {challangeList.map((item) => (
                        <div key={item.id} className="border border-[#79DFED] bg-gradient-to-br from-[#4DA2FF]/30 via-[#0a0f1b] to-[#0e1525] rounded-md mt-5 p-4 shadow-md mb-4">
                            <ChallengeCard item={item} />
                            <div className="text-center mt-2 text-sm text-gray-400">Competition Code: {item.competitionCode}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MoveToEarn;
