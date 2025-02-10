/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import Navbar from '../components/navbar';
import {
    ChatMessage,
    ChatMessageAvatar,
    ChatMessageContent,
} from '../components/ui/chat';
import {
    ChatInput,
    ChatInputSubmit,
    // ChatInputSubmit,
    ChatInputTextArea,
} from '../components/ui/chat/input';
import PulsatingDots from '../components/ui/loaders';
// import {
//     extractEventDetails,
//     googleContacts,
//     scheduleEvent,
//     trxCaller,
//     voiceSupport,
// } from '../lib/helper';
import {
    extractEventDetails,
    googleContacts,
    scheduleEvent,
    voiceSupport,
} from '../lib/helper';
import useGlobalStorage from '../store';
interface Message {
    id: string;
    content: string | JSX.Element;
    type: 'user' | 'assistant';
}
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

const YourAgent = () => {
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { userInfo } = useGlobalStorage();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            content: 'What can I help with?',
            type: 'assistant',
        },
    ]);
    const startListening = () => {
        const recognition = new (window.SpeechRecognition ||
            window.webkitSpeechRecognition)();
        recognition.lang = 'en-US'; // Set language
        recognition.interimResults = false; // Get only final result
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsLoading(true);
        };

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setValue(transcript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            setIsLoading(false);
        };

        recognition.start();
    };
    const handleSubmit = async () => {
        setMessages((prev) => [
            ...prev,
            {
                id: String(prev.length + 1),
                content: value,
                type: 'user',
            },
        ]);
        setIsLoading(true);
        try {
            setValue('');
            const isScheduleRequest =
                /schedule|book.*call|meeting|appointment/i.test(value);
            const doctorsAppointment = /connect/i.test(value);
            if (isScheduleRequest) {
                const eventDetails = extractEventDetails(value);
                const res = await scheduleEvent({
                    eventDetails,
                    attendeesEmail: localStorage.getItem('mail') || '',
                });
                const messageContent =
                    'Meeting scheduled successfully!, here is your calendar link';

                voiceSupport(messageContent);
                setMessages((prev) => [
                    ...prev,
                    {
                        id: String(prev.length + 1),
                        content: (
                            <>
                                Here is your calendar{' '}
                                <a
                                    href={res}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="underline"
                                >
                                    Link
                                </a>
                            </>
                        ),
                        type: 'assistant',
                    },
                ]);
                setIsLoading(false);
            } else if (
                value
                    .toLowerCase()
                    .includes('how is my health stats looking'.toLowerCase())
            ) {
                setTimeout(() => {
                    const messageContent = [
                        `Looking great You've kept up your streak`,
                        `Noticed you're heading to Vancouver soon. Want me to book a fitness pass there`,
                    ];
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: String(prev.length + 1),
                            content: (
                                <>
                                    <div>
                                        Looking great! 💪🔥 You've kept up your
                                        streak
                                    </div>
                                    <div>
                                        Noticed you're heading to Vancouver
                                        soon. Want me to book a fitness pass
                                        there? 🏋️‍♀️🌍
                                    </div>
                                </>
                            ),
                            type: 'assistant',
                        },
                    ]);

                    voiceSupport(messageContent.join(' '));
                    setIsLoading(false);
                }, 5000);
            } else if (
                value
                    .toLowerCase()
                    .includes(
                        'yes that sounds good share the details'.toLowerCase()
                    )
            ) {
                setTimeout(() => {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: String(prev.length + 1),
                            content: (
                                <>
                                    <div>
                                        Should I proceed with payment? Amount:
                                        2.0683 SUI ?
                                    </div>
                                </>
                            ),
                            type: 'assistant',
                        },
                    ]);
                    setIsLoading(false);
                }, 5000);
            } else if (
                value.toLowerCase().includes('yes go ahead'.toLowerCase())
            ) {
                setTimeout(() => {
                    const messageContent = [
                        'Payment confirmed',
                        'Your pass is booked. QR code and details will be sent to your email',
                    ];
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: String(prev.length + 1),
                            content: (
                                <>
                                    <div>
                                        Payment confirmed! ✅ Your pass is
                                        booked.
                                    </div>
                                    <div>
                                        QR code and details will be sent to your
                                        email.
                                    </div>
                                    <a
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline"
                                        href={
                                            'https://www.travala.com/activities/vancouver-fitness-pass-301041p78?travelDate=2025-02-28&travelDateFrom=2025-02-11'
                                        }
                                    >
                                        Here is your booking link
                                    </a>
                                </>
                            ),
                            type: 'assistant',
                        },
                    ]);
                    voiceSupport(messageContent.join(' '));

                    setIsLoading(false);
                }, 5000);
            } else if (doctorsAppointment) {
                const res = await googleContacts();
                const lastWord = value.trim().split(' ').pop()?.toLowerCase();
                const filteredContacts = res.filter((contact: any) => {
                    return contact.emailAddresses?.some((email: any) => {
                        return email.value.toLowerCase().includes(lastWord);
                    });
                });

                if (
                    filteredContacts.length > 0 &&
                    filteredContacts[0]?.emailAddresses?.length > 0
                ) {
                    const doc = filteredContacts[0].emailAddresses[0].value;

                    setMessages((prev) => [
                        ...prev,
                        {
                            id: String(prev.length + 1),
                            content: `Scheduling a call with ${doc} for tomorrow, paying 0.004 ETH for the appointment.`,
                            type: 'assistant',
                        },
                    ]);
                    const nextDay = new Date();
                    nextDay.setDate(nextDay.getDate() + 1);
                    const formattedDate = nextDay.toISOString().split('T')[0];
                    const eventDetails = {
                        summary: `Appointment with Dr. ${doc}`,
                        startDateTime: `${formattedDate}T00:00:00`,
                        duration: 30,
                    };
                    const res = await scheduleEvent({
                        eventDetails,
                        attendeesEmail: doc,
                    });
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: String(prev.length + 1),
                            content: (
                                <>
                                    Here is your calendar{' '}
                                    <a
                                        href={res}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="underline"
                                    >
                                        link
                                    </a>
                                </>
                            ),
                            type: 'assistant',
                        },
                    ]);
                    voiceSupport('Appointment scheduled successfully!');
                    setIsLoading(false);
                } else {
                    setMessages((prev) => [
                        ...prev,
                        {
                            id: String(prev.length + 1),
                            content: 'No matching email found.',
                            type: 'assistant',
                        },
                    ]);
                    setIsLoading(false);
                }
            }
        } catch (err) {
            setIsLoading(false);
            console.log(err);
        }
    };
    React.useEffect(() => {
        const messageContent = [
            'Welcome to Suiza, your personal assistant.',
            'What can I help with?',
        ];
        voiceSupport(messageContent.join(' '));
    }, []);
    return (
        <div
            className="flex bg-[#0a0f1b]       text-white  flex-col h-screen

font-chakra"
        >
            <Navbar />
            <div className="flex-1 overflow-y-auto container mx-auto mt-36 space-y-4 px-4 py-2">
                {messages.map((message) => (
                    <ChatMessage
                        key={message.id}
                        id={message.id}
                        type={message.type === 'user' ? 'outgoing' : 'incoming'}
                    >
                        {message.type === 'assistant' && <ChatMessageAvatar />}
                        <ChatMessageContent
                            content={message.content}
                            length={messages.length}
                        />
                        {message.type === 'user' && (
                            <ChatMessageAvatar imageSrc={userInfo.picture} />
                        )}
                    </ChatMessage>
                ))}
                {isLoading && <PulsatingDots />}
            </div>

            {/* Fixed Chat Input */}
            <div className="w-full bg-[#0a0f1b] fixed bottom-2 left-0">
                <div className="container mx-auto p-4">
                    <ChatInput
                        variant="default"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onSubmit={handleSubmit}
                        loading={isLoading}
                        onStop={() => setIsLoading(false)}
                    >
                        <ChatInputTextArea placeholder="Type a message..." />
                        <ChatInputSubmit startListening={startListening} />{' '}
                    </ChatInput>
                </div>
            </div>
        </div>
    );
};

export default YourAgent;