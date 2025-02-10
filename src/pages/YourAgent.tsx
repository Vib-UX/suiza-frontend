/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import Navbar from '../components/navbar';
import {
    ChatMessage,
    ChatMessageAvatar,
    ChatMessageContent,
} from '../components/ui/chat';
import {
    ChatInput,
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
    const [messages,] = useState<Message[]>([
        {
            id: '1',
            content: 'What can I help with?',
            type: 'assistant',
        },
    ]);
    // const startListening = () => {
    //     const recognition = new (window.SpeechRecognition ||
    //         window.webkitSpeechRecognition)();
    //     recognition.lang = 'en-US'; // Set language
    //     recognition.interimResults = false; // Get only final result
    //     recognition.maxAlternatives = 1;

    //     recognition.onstart = () => {
    //         setIsLoading(true);
    //     };

    //     recognition.onresult = (event: any) => {
    //         const transcript = event.results[0][0].transcript;
    //         setValue(transcript);
    //     };

    //     recognition.onerror = (event: any) => {
    //         console.error('Speech recognition error:', event.error);
    //     };

    //     recognition.onend = () => {
    //         setIsLoading(false);
    //     };

    //     recognition.start();
    // };
    // const handleSubmit = async () => {
    //     setMessages((prev) => [
    //         ...prev,
    //         {
    //             id: String(prev.length + 1),
    //             content: value,
    //             type: 'user',
    //         },
    //     ]);
    //     setIsLoading(true);
    //     try {
    //         setValue('');
    //         const isScheduleRequest =
    //             /schedule|book.*call|meeting|appointment/i.test(value);
    //         const doctorsAppointment = /connect/i.test(value);
    //         if (isScheduleRequest) {
    //             const eventDetails = extractEventDetails(value);
    //             const res = await scheduleEvent({
    //                 eventDetails,
    //                 attendeesEmail: localStorage.getItem('mail') || '',
    //             });
    //             const messageContent =
    //                 'Meeting scheduled successfully!, here is your calendar link';

    //             voiceSupport(messageContent);
    //             setMessages((prev) => [
    //                 ...prev,
    //                 {
    //                     id: String(prev.length + 1),
    //                     content: (
    //                         <>
    //                             Here is your calendar{' '}
    //                             <a
    //                                 href={res}
    //                                 target="_blank"
    //                                 rel="noreferrer"
    //                                 className="underline"
    //                             >
    //                                 Link
    //                             </a>
    //                         </>
    //                     ),
    //                     type: 'assistant',
    //                 },
    //             ]);
    //             setIsLoading(false);
    //         } else if (value.toLowerCase().includes('any upcoming crypto')) {
    //             setTimeout(() => {
    //                 const messageContent = [
    //                     'Here are some major ETH events coming up.',
    //                     'Hong Kong Consensus 2025, February 18th to 20th.',
    //                     'Pragma ETH Denver, February 25th, the largest ETH gathering of the month!',
    //                 ];
    //                 setMessages((prev) => [
    //                     ...prev,
    //                     {
    //                         id: String(prev.length + 1),
    //                         content: (
    //                             <>
    //                                 <div>
    //                                     🚀 Here are some major ETH events coming
    //                                     up:
    //                                 </div>
    //                                 <div>
    //                                     📍 Hong Kong Consensus 2025 – February
    //                                     18th-20th
    //                                 </div>
    //                                 <div>
    //                                     📍 Pragma ETH Denver – February 25th,
    //                                     the largest ETH gathering of the month!
    //                                 </div>
    //                             </>
    //                         ),
    //                         type: 'assistant',
    //                     },
    //                 ]);

    //                 voiceSupport(messageContent.join(' '));
    //                 setIsLoading(false);
    //             }, 5000);
    //         } else if (value.toLowerCase().includes('pragma')) {
    //             setTimeout(() => {
    //                 setMessages((prev) => [
    //                     ...prev,
    //                     {
    //                         id: String(prev.length + 1),
    //                         content: (
    //                             <>
    //                                 <div>
    //                                     ✅ Registration confirmed for Pragma ETH
    //                                     Denver!
    //                                 </div>
    //                                 <div>
    //                                     🛏️ Hotel: The Ritz-Carlton, Denver
    //                                 </div>
    //                                 <div>📅 Stay: February 23rd - 25th</div>
    //                                 <div>
    //                                     🔗 Travala Booking{' '}
    //                                     <a
    //                                         href="https://www.travala.com/booking?check_in=2025-02-23&check_out=2025-02-25&hotel_id=17198&location=5129540&package_id=391417031&place_types=AIRPORT&popular=FB&r1=1&roomBoards=BB&search_code=VZykGtWvlIjVr3en&step=payments"
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="underline"
    //                                     >
    //                                         Link
    //                                     </a>
    //                                 </div>
    //                                 <div>
    //                                     💳 Total Cost: 0.457832 ETH (Mainnet)
    //                                 </div>
    //                                 <div>
    //                                     💰 Payment Address:
    //                                     0xDfEcdDb5479d0d68C491963160b004571B6d680A
    //                                 </div>
    //                                 <div>
    //                                     Would you like me to proceed with the
    //                                     payment for your hotel stay?
    //                                 </div>
    //                             </>
    //                         ),
    //                         type: 'assistant',
    //                     },
    //                 ]);
    //                 setIsLoading(false);
    //             }, 5000);
    //         } else if (value.toLowerCase().includes('yes go ahead')) {
    //             let eventDetails = {
    //                 summary: 'Pragma ETH Denver, At The Ritz-Carlton',
    //                 startDateTime: '2022-02-23T00:00:00',
    //                 duration: 2880,
    //             };
    //             const res = await scheduleEvent({
    //                 eventDetails,
    //                 attendeesEmail: localStorage.getItem('mail') || '',
    //             });
    //             const trxData = await trxCaller(
    //                 4,
    //                 '0xDfEcdDb5479d0d68C491963160b004571B6d680A',
    //                 userInfo.uid
    //             );

    //             setTimeout(() => {
    //                 const messageContent = [
    //                     'Your booking is confirmed for Pragma ETH Denver!',
    //                     'At The Ritz-Carlton on February 23rd - 25th.',
    //                     'Youre all set See you there!',
    //                 ];
    //                 setMessages((prev) => [
    //                     ...prev,
    //                     {
    //                         id: String(prev.length + 1),
    //                         content: (
    //                             <>
    //                                 <div>💳 Processing payment...</div>
    //                                 <div>
    //                                     ✅ Payment confirmed!{' '}
    //                                     <a
    //                                         href={`https://sepolia.basescan.org/tx/${trxData.data}`}
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="underline"
    //                                     >
    //                                         Explorer link
    //                                     </a>
    //                                 </div>
    //                                 <div>
    //                                     📅 Schedule updated in your calendar. (
    //                                     <a
    //                                         href={res}
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="underline"
    //                                     >
    //                                         Link
    //                                     </a>
    //                                     )
    //                                 </div>
    //                                 <div>
    //                                     📜 Booking Details:{' '}
    //                                     <a
    //                                         href="https://testnet.flowscan.io/account/bf7fff8568b04f9e"
    //                                         target="_blank"
    //                                         rel="noreferrer"
    //                                         className="underline"
    //                                     >
    //                                         Link
    //                                     </a>
    //                                 </div>
    //                                 <div>Event: Pragma ETH Denver</div>
    //                                 <div>Hotel: The Ritz-Carlton, Denver</div>
    //                                 <div>Check-in: February 23rd</div>
    //                                 <div>Check-out: February 25th</div>
    //                                 <div>Booking Ref: #TRV391417031</div>
    //                                 <div>
    //                                     🎉 You're all set for ETH Denver! 🚀 See
    //                                     you there!
    //                                 </div>
    //                             </>
    //                         ),
    //                         type: 'assistant',
    //                     },
    //                 ]);
    //                 voiceSupport(messageContent.join(' '));

    //                 setIsLoading(false);
    //             }, 5000);
    //         } else if (value.toLowerCase().includes('send')) {
    //             const words = value.split(' ');
    //             const amount = Number(words[1]);
    //             const address = words[words.indexOf('to') + 1];
    //             const trxData = await trxCaller(
    //                 amount * 1e18,
    //                 address,
    //                 userInfo.uid
    //             );
    //             setMessages((prev) => [
    //                 ...prev,
    //                 {
    //                     id: String(prev.length + 1),
    //                     content: (
    //                         <>
    //                             Transaction sent successfully!{' '}
    //                             <a
    //                                 href={`https://sepolia.basescan.org/tx/${trxData.data}`}
    //                                 target="_blank"
    //                                 rel="noreferrer"
    //                                 className="underline"
    //                             >
    //                                 Link
    //                             </a>
    //                         </>
    //                     ),
    //                     type: 'assistant',
    //                 },
    //             ]);
    //             setIsLoading(false);
    //         } else if (doctorsAppointment) {
    //             const res = await googleContacts();
    //             const lastWord = value.trim().split(' ').pop()?.toLowerCase();
    //             const filteredContacts = res.filter((contact: any) => {
    //                 return contact.emailAddresses?.some((email: any) => {
    //                     return email.value.toLowerCase().includes(lastWord);
    //                 });
    //             });

    //             if (
    //                 filteredContacts.length > 0 &&
    //                 filteredContacts[0]?.emailAddresses?.length > 0
    //             ) {
    //                 const doc = filteredContacts[0].emailAddresses[0].value;

    //                 setMessages((prev) => [
    //                     ...prev,
    //                     {
    //                         id: String(prev.length + 1),
    //                         content: `Scheduling a call with ${doc} for tomorrow, paying 0.004 ETH for the appointment.`,
    //                         type: 'assistant',
    //                     },
    //                 ]);
    //                 const trxData = await trxCaller(
    //                     4.0e15,
    //                     '0x8411CbB1e7d1ed5450e07571cEC04254E490A2D2',
    //                     userInfo.uid
    //                 );
    //                 setMessages((prev) => [
    //                     ...prev,
    //                     {
    //                         id: String(prev.length + 1),
    //                         content: (
    //                             <>
    //                                 Payment successful!{' '}
    //                                 <a
    //                                     href={`https://sepolia.basescan.org/tx/${trxData.data}`}
    //                                     target="_blank"
    //                                     rel="noreferrer"
    //                                     className="underline"
    //                                 >
    //                                     Link
    //                                 </a>
    //                             </>
    //                         ),
    //                         type: 'assistant',
    //                     },
    //                 ]);
    //                 const nextDay = new Date();
    //                 nextDay.setDate(nextDay.getDate() + 1);
    //                 const formattedDate = nextDay.toISOString().split('T')[0];
    //                 let eventDetails = {
    //                     summary: `Appointment with Dr. ${doc}`,
    //                     startDateTime: `${formattedDate}T00:00:00`,
    //                     duration: 30,
    //                 };
    //                 const res = await scheduleEvent({
    //                     eventDetails,
    //                     attendeesEmail: doc,
    //                 });
    //                 setMessages((prev) => [
    //                     ...prev,
    //                     {
    //                         id: String(prev.length + 1),
    //                         content: (
    //                             <>
    //                                 Here is your calendar{' '}
    //                                 <a
    //                                     href={res}
    //                                     target="_blank"
    //                                     rel="noreferrer"
    //                                     className="underline"
    //                                 >
    //                                     link
    //                                 </a>
    //                             </>
    //                         ),
    //                         type: 'assistant',
    //                     },
    //                 ]);
    //                 voiceSupport('Appointment scheduled successfully!');
    //                 setIsLoading(false);
    //             } else {
    //                 setMessages((prev) => [
    //                     ...prev,
    //                     {
    //                         id: String(prev.length + 1),
    //                         content: 'No matching email found.',
    //                         type: 'assistant',
    //                     },
    //                 ]);
    //                 setIsLoading(false);
    //             }
    //         } else {
    //             const res = await fetch(
    //                 'https://orion-eliza-production.up.railway.app/api/knowledge-base/query',
    //                 {
    //                     method: 'POST',
    //                     headers: {
    //                         'Content-Type': 'application/json',
    //                     },
    //                     body: JSON.stringify({
    //                         name: localStorage.getItem('dynamicId'),
    //                         question: value,
    //                     }),
    //                 }
    //             );

    //             if (!res.ok) {
    //                 throw new Error('Failed to fetch chat data');
    //             }

    //             const data = await res.json();

    //             setMessages((prev) => [
    //                 ...prev,
    //                 {
    //                     id: String(prev.length + 1),
    //                     content: data,
    //                     type: 'assistant',
    //                 },
    //             ]);
    //             setIsLoading(false);
    //         }
    //     } catch (err) {
    //         setIsLoading(false);
    //         console.log(err);
    //     }
    // };
    // React.useEffect(() => {
    //     const messageContent = [
    //         'Welcome to Orion, your personal assistant.',
    //         'What can I help with?',
    //     ];
    //     voiceSupport(messageContent.join(' '));
    // }, []);
    return (
        <div className="flex bg-[#0a0f1b]       text-white  flex-col h-[90vh]

font-chakra">
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
            <div className="w-full bg-black fixed bottom-2 left-0">
                <div className="container mx-auto p-4">
                    <ChatInput
                        variant="default"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        // onSubmit={handleSubmit}
                        loading={isLoading}
                        onStop={() => setIsLoading(false)}
                    >
                        <ChatInputTextArea placeholder="Type a message..." />
                        {/* <ChatInputSubmit startListening={startListening} />{' '} */}
                    </ChatInput>
                </div>
            </div>
        </div>
    );
};

export default YourAgent;
