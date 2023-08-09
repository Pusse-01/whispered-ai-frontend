import React, { useState, useEffect } from 'react';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI
import { getUserDataFromLocalStorage } from '../utils'

import API_BASE_URL from '../config';

const AllConversations = ({ onCardClick }) => {
    const user = getUserDataFromLocalStorage();

    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            let url = `${API_BASE_URL}/conversations/?user_id=${user._id}`;


            // Fetch data from the endpoint
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    setConversations(data);
                    setIsLoading(false); // Set loading to false after data is fetched
                    console.log(data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    setIsLoading(false); // Set loading to false on error
                    // Handle error here, e.g., show an error message on the UI
                });
        }
    }, []);

    function formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    }

    // Show spinner while loading
    if (isLoading) {
        return <CircularProgress style={{ margin: 'auto' }} />;
    }

    return (
        <div>
            {/* List of conversation cards */}
            {conversations.map((conversation) => (
                <div key={conversation.id} className="border px-4 py-2 mb-4 rounded-lg w-5/6 cursor-pointer" onClick={() => onCardClick(conversation.id)}>
                    <div className="flex flex-col items-start">
                        <p className="text-md font-semibold">{conversation.name}</p>
                        <p className="text-sm text-gray-500">Last Updated: {formatDate(conversation.last_updated)}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AllConversations;
