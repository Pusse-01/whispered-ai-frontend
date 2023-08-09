import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import Button from '@mui/material/Button';
import BotLogo from '../assets/Bot.png';
import UserLogo from '../assets/user.png';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import API_BASE_URL from '../config';
import { getUserDataFromLocalStorage } from '../utils'

const NewConversations = () => {
    const user = getUserDataFromLocalStorage();
    // State to keep track of the user input message
    const [message, setMessage] = useState('');
    // Ref for scrolling to the bottom of chat messages
    const chatContainerRef = useRef(null);
    const choices = [
        { title: 'Marketing' },
        { title: 'HR' },
        { title: 'IT' },
        { title: 'Designing' },
        { title: 'Finance' },
        { title: 'All' },
        // Add more tags if needed
    ];
    const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
    const [isLoading, setIsLoading] = useState(false);
    const [chatData, setChatData] = useState({})
    const { chatID } = useParams();
    // Dummy data for chat messages (user and bot)
    // const chatMessages = [
    //     { id: 1, sender: 'user', text: 'Hello' },
    //     { id: 2, sender: 'bot', text: 'Hi, how can I help you?' },

    //     // Add more chat messages if needed
    // ];
    console.log(chatID);
    const handleChangeMessage = (e) => {
        setMessage(e.target.value);
    };

    const handleSendMessage = async () => {
        try {
            setIsLoading(true);
            // Send the user message to the backend
            const msg = message
            setChatMessages(prevMessages => [
                ...prevMessages,
                { sender: 'user', text: message },
                { sender: 'typing', text: 'typing...' }, // Add typing message
            ]);
            setMessage('')

            const response = await fetch(`${API_BASE_URL}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: msg,
                    user_id: user._id,
                    conversation_id: chatID,
                    files: chatData.documents, // Add files if needed
                    tags: chatData.tags, // Add tags if needed
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
                { sender: 'bot', text: botReply },
            ]);

            setMessage(''); // Clear the input field
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Scroll to the bottom of the chat messages when a new message is added
    useEffect(() => {
        console.log(chatID)
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        const fetchPreviousMessages = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/conversation/${chatID}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch conversation');
                }

                const data = await response.json();

                const messages = data.messages.map(msg => ({ sender: msg.user, text: msg.text }));
                setChatMessages(messages);
                setChatData(data)
                console.log(messages)
            } catch (error) {
                console.error('Error fetching conversation:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPreviousMessages();
    }, [chatID]);

    return (
        <div
            style={{ height: '70vh' }}
            className=" flex flex-col">


            <div
                className="flex justify-between items-center mb-4 flex-wrap"
            >
                <div className="text-lg">Hi there! How can I help you?</div>
                {/* <div className="flex items-center justify-between w-2/5">
                    <label className="text-sm font-medium text-gray-700">
                        Include
                    </label>
                    <Autocomplete
                        multiple
                        id="bot-tags"
                        size="small"
                        options={choices}
                        sx={{ width: '200px' }}
                        getOptionLabel={(option) => option.title}
                        defaultValue={[]}
                        renderInput={(params) => (
                            <TextField
                                sx={{ overflow: 'hidden' }}
                                {...params}
                                variant="standard"
                                fullWidth
                                placeholder="Add tags to select folders"
                            />
                        )}
                    />
                </div> */}

            </div>
            {/* Chat interface */}
            <div
                className="border p-4 mb-4 flex-1 flex-grow overflow-y-auto"
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
                                src={message.sender === 'user' ? UserLogo : BotLogo}
                                alt="Logo"
                                className="w-6 h-6 mr-2"
                            />
                            <div
                                className={`p-2 flex justify-start text-left rounded ${message.sender === 'user' ? 'bg-white' : 'bg-gray-200'
                                    }`}
                            >
                                {message.text}
                            </div>
                        </div>

                    ))}
                </div>
            </div>
            {/* Input field for user message */}
            <div className="flex items-center">
                <input
                    type="text"
                    className="flex-1 mr-2 p-2 border rounded"
                    placeholder="Type your message..."
                    value={message}
                    onChange={handleChangeMessage}
                />
                <button
                    className="bg-blue-500 text-white p-2 rounded"
                    onClick={handleSendMessage}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default NewConversations;
