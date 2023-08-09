import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import Button from '@mui/material/Button';
import AllConversations from './all_conversations'
import NewConversations from './new_conversations';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI
import { getUserDataFromLocalStorage } from '../utils'

import API_BASE_URL from '../config';

const Chats = () => {
    const user = getUserDataFromLocalStorage();
    // State to keep track of the selected menu item
    const [selectedItem, setSelectedItem] = useState('allConversations');
    const [chatID, seChatID] = useState('')
    const [isLoading, setIsLoading] = useState(false); // State to track loading status

    const navigate = useNavigate();

    // const handleNewConversation = (() => {
    //     setSelectedItem('newConversations')
    // })

    const handlesAllClick = () => {
        setSelectedItem('allConversations');
        navigate('/chats');
    }


    const handleNewConversation = async (e) => {

        try {
            setIsLoading(true);
            const currentDate = new Date().toISOString().split('T')[0];
            const response = await fetch(`${API_BASE_URL}/create_new_chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bot_id: '',
                    messages: [],
                    // last_updated: currentDate,
                    specialty: [],
                    documents: [],
                    userID: user._id

                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create conversation');
            }
            const data = await response.json();
            console.log(data);
            const chatID = data.id;
            setIsLoading(false); // Assuming the response contains the chat_id
            setSelectedItem('newConversations');
            navigate(`/chats/${chatID}`); // Navigate to the newly created conversation
        } catch (error) {
            console.error('Error creating conversation:', error);
            setIsLoading(false);
            // Handle error here, e.g., show an error message on the UI
        }
    };

    const handleConversationCardClick = (conversationId) => {
        setSelectedItem('newConversations');
        navigate(`/chats/${conversationId}`); // Navigate to /chats/{conversationId} when a conversation card is clicked
    }

    // if (isLoading) {
    //     return <CircularProgress style={{ margin: 'auto' }} />;
    // }

    return (
        <div className="container px-4 md:px-8 py-4 ml-20">
            <div
                className="flex justify-between items-center mb-4 flex-wrap"
            >
                <div className="text-2xl font-bold">Conversations</div>
                <Button
                    variant="contained"
                    startIcon={<ControlPointOutlinedIcon />}
                    style={{ backgroundColor: '#1250B9' }}
                    className="text-white ml-4 rounded-xl"
                    onClick={handleNewConversation}
                >
                    New Conversation
                </Button>
            </div>

            {/* Horizontal menu items */}
            <div className="flex mb-4">
                <div
                    className={`px-4 py-2 cursor-pointer ${selectedItem === 'allConversations' ? 'border-b-2 border-blue-500' : ''
                        }`}
                    onClick={handlesAllClick}
                >
                    All
                </div>
                <div
                    className={`px-4 py-2 cursor-pointer ${selectedItem === 'newConversations' ? 'border-b-2 border-blue-500' : ''
                        }`}
                    onClick={handleNewConversation}
                >
                    New Conversations
                </div>
                {/* Add more menu items if needed */}
            </div>

            {/* Render content based on the selected menu item */}
            {selectedItem === 'allConversations' ?
                <AllConversations onCardClick={handleConversationCardClick} />
                : <NewConversations />}

            {isLoading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-opacity-75 bg-gray-500">
                    <div className="flex items-center">
                        <CircularProgress style={{ marginRight: '8px' }} color="inherit" />
                        <span>New conversation is creating!</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chats;
