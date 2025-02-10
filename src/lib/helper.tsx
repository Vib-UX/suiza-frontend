import toast from 'react-hot-toast';
import { toastStyles } from '../config';

export const generateCodeVerifier = (): string => {
    const array = new Uint8Array(64);
    crypto.getRandomValues(array);

    return Array.from(array, (byte) =>
        ('0' + byte.toString(16)).slice(-2)
    ).join('');
};
const sha256 = async (message: string): Promise<ArrayBuffer> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    return crypto.subtle.digest('SHA-256', data);
};
const base64UrlEncode = (arrayBuffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(arrayBuffer);
    const base64String = btoa(String.fromCharCode(...bytes));
    return base64String
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
};
export const generateCodeChallenge = async (
    codeVerifier: string
): Promise<string> => {
    const hashedBuffer = await sha256(codeVerifier);
    return base64UrlEncode(hashedBuffer);
};
export const scheduleEvent = async ({
    eventDetails,
    attendeesEmail,
}: {
    eventDetails: any;
    attendeesEmail?: string;
}) => {
    const token = localStorage.getItem('googleAuth');
    const duration = eventDetails.duration || 30;
    const event = {
        summary: eventDetails.summary,
        start: {
            dateTime: new Date(eventDetails.startDateTime).toISOString(),
            timeZone: 'UTC',
        },
        end: {
            dateTime: new Date(
                new Date(eventDetails.startDateTime).getTime() +
                    duration * 60000
            ).toISOString(),
            timeZone: 'UTC',
        },
        attendees: [
            {
                email: attendeesEmail,
            },
        ],
    };

    try {
        const response = await fetch(
            'https://www.googleapis.com/calendar/v3/calendars/primary/events',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(event),
            }
        );

        const data = await response.json();

        if (response.ok && data.htmlLink) {
            // toast.success(`Event Scheduled successfully`, toastStyles);
            return data.htmlLink;
        } else {
            return toast.error(
                `Failed to schedule event: ${data.error?.message}`,
                toastStyles
            );
        }
    } catch (error) {
        toast.error('Error scheduling event:', toastStyles);
    }
};
export const extractEventDetails = (userInput: string) => {
    // Default values
    let summary = 'Scheduled Event';
    let dateTime = new Date();
    let duration = 30; // Default duration in minutes

    // Extract title (any text before "on" or "at")
    const titleMatch = userInput.match(
        /(schedule|book|set up)\s+(.+?)(\s+on|\s+at|$)/i
    );
    if (titleMatch) {
        summary = titleMatch[2].trim();
    }

    // Extract date and time
    const dateMatch = userInput.match(
        /\b(tomorrow|today|next\s+\w+|(?:\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}))\b/i
    );
    const timeMatch = userInput.match(/(\d{1,2}(:\d{2})?\s?(AM|PM)?)/i);

    if (dateMatch) {
        const extractedDate = dateMatch[0].toLowerCase();
        if (extractedDate === 'tomorrow') {
            dateTime.setDate(dateTime.getDate() + 1);
        } else if (extractedDate === 'today') {
            // No change needed, date is already today
        } else {
            dateTime = new Date(extractedDate);
        }
    }

    if (timeMatch) {
        let timeString = timeMatch[1];
        const isPM = timeString.includes('PM');
        let [hours, minutes] = timeString
            .replace(/(AM|PM)/i, '')
            .split(':')
            .map(Number);
        if (isPM && hours < 12) hours += 12;
        if (!minutes) minutes = 0;

        dateTime.setHours(hours, minutes, 0);
    }

    // Extract duration (e.g., "for 30 minutes", "for 1 hour")
    const durationMatch = userInput.match(/for\s+(\d+)\s*(minutes?|hours?)/i);
    if (durationMatch) {
        duration =
            parseInt(durationMatch[1]) *
            (durationMatch[2].includes('hour') ? 60 : 1);
    }

    return { summary, startDateTime: dateTime.toISOString(), duration };
};
export const trxCaller = async (
    amount: number,
    address: string,
    id: string[]
) => {
    const res = await fetch(
        'https://orion-server-wallet-production.up.railway.app/api/send-transaction',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                wallet_id: id,
                to: address,
                value: amount,
                chain_name: 'base',
            }),
        }
    );
    const data = await res.json();
    return { data: data.data.hash };
};
export const googleContacts = async () => {
    const token = localStorage.getItem('googleAuth');
    try {
        const response = await fetch(
            'https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses',
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        const data = await response.json();
        return data.connections;
    } catch (error) {
        toast.error('Error scheduling event:', toastStyles);
    }
};
export const voiceSupport = (messageContent: string) => {
    const speak = () => {
        const utterance = new SpeechSynthesisUtterance(messageContent);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 0.5; // Deep voice

        const voices = speechSynthesis.getVoices();
        if (voices.length === 0) {
            console.warn('No voices available yet.');
            return;
        }

        const maleVoice = voices.find(
            (voice) =>
                voice.name.includes('Male') ||
                voice.name.includes('Deep') ||
                voice.name.includes('Barry')
        );

        if (maleVoice) {
            utterance.voice = maleVoice;
        } else {
            console.warn('No deep male voice found. Using default.');
        }

        speechSynthesis.speak(utterance);
    };

    if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = speak; // Wait for voices to load
    } else {
        speak(); // If voices are already available, speak immediately
    }
};
