import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import AllConversations from './all_conversations'
import NewConversations from './new_conversations';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI
import { getUserDataFromLocalStorage } from '../utils'
import { TextField, Typography, Dialog, Button, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import BotLogo from '../assets/Bot.png';
import UserLogo from '../assets/user.png';
import ReactMarkdown from 'react-markdown'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import './styling.css'

import { API_BASE_URL } from '../config';

const ChatSharingWidget = () => {
    const chatContainerRef = useRef(null);
    const [isLoadingPage, setIsLoadingPage] = useState(false)
    const [chatMessages, setChatMessages] = useState([{ user: 'bot', text: 'Hi there! How can I help you?' }]);
    const [message, setMessage] = useState('');
    const { chatID } = useParams();
    const [isChatOpen, setIsChatOpen] = useState(false);

    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        console.log('Component mounted')
    }, [])


    const handleSendMessage = async () => {
        try {
            setIsLoadingPage(true);
            // Send the user message to the backend
            const msg = message
            const msgs = chatMessages
            setChatMessages(prevMessages => [
                ...prevMessages,
                { user: 'user', text: message },
                { user: 'typing', text: 'typing...' }, // Add typing message
            ]);
            setMessage('')

            const response = await fetch(`${API_BASE_URL}/sharedbot-chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: msg,
                    conversation_id: chatID,
                    msgs: msgs
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            const botReply = data.answer;

            // Update chat messages with the user's and bot's replies
            setChatMessages(prevMessages => [
                ...prevMessages.slice(0, -1), // Remove the last "typing..." message
                { user: 'bot', text: botReply },
            ]);
            setMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoadingPage(false);
        }
    };

    return (
        <div className={`container mx-auto chat-container ${isChatOpen ? 'open' : ''}`}>
            {/* Launcher button */}
            <button className="launcher-button" onClick={toggleChat}>
                {isChatOpen ? <CancelOutlinedIcon /> : <ControlPointOutlinedIcon />}
            </button>
            <div className={`chat-container ${isChatOpen ? 'open' : ''}`}>
                {/* ... chat interface */}
                <div className='bg-[#1d4ed8] rounded-t-xl'

                >
                    <p className='p-4 text-left text-white'>Whispered AI</p>
                </div>
                <div
                    style={{ height: '70vh' }}
                    className=" flex flex-col pb-4 border rounded-lg shadow-xl">

                    {/* Chat interface */}
                    <div
                        className=" p-4 flex-1 flex-grow overflow-y-auto"
                        ref={chatContainerRef}
                    >
                        <div class="flex flex-col">
                            {/* Chat messages */}
                            {chatMessages.map((message) => (
                                <div
                                    key={message.id}
                                    className={'p-2 flex justify-start'}
                                // ${message.sender === 'user' ? 'justify-end' : '
                                >
                                    <img
                                        src={message.user === 'user' ? UserLogo : BotLogo}
                                        alt="Logo"
                                        className="w-6 h-6 mr-2"
                                    />
                                    <div
                                        className={`p-2 justify-start text-left rounded ${message.user === 'user' ? 'bg-white' : 'bg-gray-200'
                                            }`}
                                    >
                                        {message.text === 'typing...' ? (
                                            <div className="loading text-sm text-gray-500">...</div>
                                        ) : (
                                            <ReactMarkdown>{message.text}</ReactMarkdown>
                                        )}
                                        {/* <div dangerouslySetInnerHTML={{ __html: message.text }} /> */}

                                    </div>
                                </div>

                            ))}
                        </div>
                    </div>
                    {/* Input field for user message */}
                    <div className="flex items-center px-2">
                        <input
                            type="text"
                            className="flex-1 mr-2 p-2 border rounded"
                            placeholder="Type your message..."
                            value={message}
                            onChange={handleChangeMessage}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            className="bg-[#1d4ed8] text-white p-2 rounded"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ChatSharingWidget;
