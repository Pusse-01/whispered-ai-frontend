import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import AllConversations from './all_conversations'
import NewConversations from './new_conversations';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI
import { getUserDataFromLocalStorage } from '../utils'
import { TextField, Typography, Dialog, Button, DialogContent, DialogTitle, DialogActions, colors } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import BotLogo from '../assets/Bot.png';
import UserLogo from '../assets/user.png';
import ReactMarkdown from 'react-markdown'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import './styling.css'

import { API_BASE_URL } from '../config';

const CustomizedChatSharingWidget = () => {
    const chatContainerRef = useRef(null);
    const [isLoadingPage, setIsLoadingPage] = useState(false)
    const [chatMessages, setChatMessages] = useState([{ user: 'bot', text: 'Hi there! How can I help you?' }]);
    const [message, setMessage] = useState('');
    const [chatData, setChatData] = useState();
    const { chatID } = useParams();
    // const { title } = useParams();
    const queryString = window.location.search;

    // Parse the query string to extract the parameters
    const urlParams = new URLSearchParams(queryString);

    // Get the 'title' parameter value
    const title = urlParams.get('title');
    const headerLayout = urlParams.get('headerLayout')
    const headerBackgroundColor = urlParams.get('headerBackgroundColor')
    const subtitle = urlParams.get('subtitle')
    const botMessageBackground = urlParams.get('botMessageBackground')
    const humanMessageBackground = urlParams.get('humanMessageBackground')
    const composerPlaceholder = urlParams.get('composerPlaceholder')
    const humanMessageColor = urlParams.get('humanMessageColor')
    const botMessageColor = urlParams.get('botMessageColor')

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
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        const fetchPreviousMessages = async () => {
            try {
                // setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/conversation/${chatID}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch conversation');
                }

                const data = await response.json();
                console.log(data)
                // const messages = data.messages.map(msg => ({ sender: msg.user, text: msg.text }));
                // setChatMessages(messages);
                setChatData(data)

            } catch (error) {
                console.error('Error fetching conversation:', error);
            } finally {
                // setIsLoading(false);
            }
        };

        fetchPreviousMessages();
    }, [chatID]);


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
    console.log(botMessageColor, humanMessageColor)

    return (
        <div className={`container mx-auto chat-container ${isChatOpen ? 'open' : ''}`}>
            {/* Launcher button */}
            <button className="launcher-button" onClick={toggleChat}>
                {isChatOpen ? <CancelOutlinedIcon /> : <ControlPointOutlinedIcon />}
            </button>
            <div className={`chat-container ${isChatOpen ? 'open' : ''}`}>
                {/* ... chat interface */}
                <div className={`bg-[#${headerBackgroundColor || '1d4ed8'}] rounded-t-xl p-2`}

                >
                    <p className={`px-2 text-left text-white  text-${headerLayout || 'left'} text-lg`}>{title ? title : 'Whispered AI'}</p>
                    <p className={`px-2 text-left text-white  text-${headerLayout || 'left'} text-sm`}>{subtitle ? subtitle : ''}</p>
                </div>
                <div
                    style={{ height: '70vh' }}
                    className=" flex flex-col pb-4 border rounded-lg shadow-xl bg-white">

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
                                    {message.user === 'user' ?
                                        <>

                                            <div

                                                style={{
                                                    backgroundColor: `#${humanMessageBackground || '1d4ed8'}`, color: `#${humanMessageColor || 'ffffff'}`
                                                }}
                                                className={`p-2 justify-start text-left rounded `}
                                            >
                                                {message.text === 'typing...' ? (
                                                    <div className="loading text-sm">...</div>
                                                ) : (
                                                    <ReactMarkdown>{message.text}</ReactMarkdown>
                                                )}
                                                {/* <div dangerouslySetInnerHTML={{ __html: message.text }} /> */}
                                            </div>
                                        </> :
                                        <>
                                            <div
                                                style={{ backgroundColor: `#${botMessageBackground || 'c0c0c0'}`, color: `#${botMessageColor || '000000'}` }}
                                                className={`p-2 justify-start text-left rounded`}
                                            >
                                                {message.text === 'typing...' ? (
                                                    <div

                                                        className={`loading text-sm`}>...</div>
                                                ) : (
                                                    <ReactMarkdown>{message.text}</ReactMarkdown>
                                                )}
                                                {/* <div dangerouslySetInnerHTML={{ __html: message.text }} /> */}

                                            </div>
                                        </>
                                    }

                                </div>

                            ))}
                        </div>
                    </div>
                    {/* Input field for user message */}
                    <div className="flex items-center px-2">
                        <input
                            type="text"
                            className="flex-1 mr-2 p-2 border rounded"
                            placeholder={composerPlaceholder ? composerPlaceholder : 'Type your message...'}
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

        </div >
    );
};

export default CustomizedChatSharingWidget;
