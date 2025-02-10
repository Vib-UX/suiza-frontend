/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from 'clsx';
import { ArrowUpIcon } from 'lucide-react';
import type React from 'react';
import { createContext, useContext } from 'react';
import { useTextareaResize } from '../../../hooks/use-textarea-resize';

interface ChatInputContextValue {
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onSubmit?: () => void;
    loading?: boolean;
    onStop?: () => void;
    variant?: 'default' | 'unstyled';
    rows?: number;
}

const ChatInputContext = createContext<ChatInputContextValue>({});

interface ChatInputProps extends Omit<ChatInputContextValue, 'variant'> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'unstyled';
    rows?: number;
}

function ChatInput({
    children,
    className,
    variant = 'default',
    value,
    onChange,
    onSubmit,
    loading,
    onStop,
    rows = 1,
}: ChatInputProps) {
    const contextValue: ChatInputContextValue = {
        value,
        onChange,
        onSubmit,
        loading,
        onStop,
        variant,
        rows,
    };

    return (
        <ChatInputContext.Provider value={contextValue}>
            <div
                className={clsx(
                    variant === 'default' &&
                    'flex flex-col items-end w-full p-2 rounded-2xl border border-input bg-transparent focus-within:ring-1 focus-within:ring-ring focus-within:outline-none',
                    variant === 'unstyled' && 'flex items-start gap-2 w-full',
                    className
                )}
            >
                {children}
            </div>
        </ChatInputContext.Provider>
    );
}

ChatInput.displayName = 'ChatInput';

interface ChatInputTextAreaProps extends React.ComponentProps<any> {
    value?: string;
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
    onSubmit?: () => void;
    variant?: 'default' | 'unstyled';
    className?: string;
}

function ChatInputTextArea({
    onSubmit: onSubmitProp,
    value: valueProp,
    onChange: onChangeProp,
    className,
    variant: variantProp,
    ...props
}: ChatInputTextAreaProps) {
    const context = useContext(ChatInputContext);
    const value = valueProp ?? context.value ?? '';
    const onChange = onChangeProp ?? context.onChange;
    const onSubmit = onSubmitProp ?? context.onSubmit;
    const rows = context.rows ?? 1;

    // Convert parent variant to textarea variant unless explicitly overridden
    const variant =
        variantProp ?? (context.variant === 'default' ? 'unstyled' : 'default');

    const textareaRef = useTextareaResize(value, rows);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!onSubmit) {
            return;
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            if (typeof value !== 'string' || value.trim().length === 0) {
                return;
            }
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <textarea
            ref={textareaRef}
            {...props}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            className={clsx(
                'h-full focus:outline-none resize-none overflow-x-hidden w-full',
                variant === 'unstyled' &&
                'border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none',
                className
            )}
            rows={rows}
        />
    );
}

ChatInputTextArea.displayName = 'ChatInputTextArea';

interface ChatInputSubmitProps extends React.ComponentProps<any> {
    onSubmit?: () => void;
    loading?: boolean;
    onStop?: () => void;
    startListening?: () => void;
}

function ChatInputSubmit({
    onSubmit: onSubmitProp,
    loading: loadingProp,
    onStop: onStopProp,
    className,
    startListening,
    ...props
}: ChatInputSubmitProps) {
    const context = useContext(ChatInputContext);
    const loading = loadingProp ?? context.loading;
    const onStop = onStopProp ?? context.onStop;
    const onSubmit = onSubmitProp ?? context.onSubmit;

    if (loading && onStop) {
        return (
            <button
                onClick={onStop}
                className={clsx(
                    'shrink-0 rounded-full p-1.5 h-fit border dark:border-zinc-600',
                    className
                )}
                {...props}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-label="Stop"
                >
                    <title>Stop</title>
                    <rect x="6" y="6" width="12" height="12" />
                </svg>
            </button>
        );
    }

    const isDisabled =
        typeof context.value !== 'string' || context.value.trim().length === 0;

    return (
        <div className="flex items-center gap-x-6">
            <button
                onClick={startListening}
                className="text-white cursor-pointer"
                aria-label="Read message"
            >
                🔊
            </button>
            <button
                className={clsx(
                    'shrink-0 cursor-pointer rounded-full p-1.5 h-fit border dark:border-zinc-600',
                    className
                )}
                disabled={isDisabled}
                onClick={(event) => {
                    event.preventDefault();
                    if (!isDisabled) {
                        onSubmit?.();
                    }
                }}
                {...props}
            >
                <ArrowUpIcon />
            </button>
        </div>
    );
}

ChatInputSubmit.displayName = 'ChatInputSubmit';

export { ChatInput, ChatInputTextArea, ChatInputSubmit };
