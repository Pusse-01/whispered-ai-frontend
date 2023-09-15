import React, { useState, useEffect } from 'react';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI
import { getUserDataFromLocalStorage } from '../utils'
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './styling.css'

import { API_BASE_URL } from '../config';

const AllConversations = ({ onCardClick }) => {
    const user = getUserDataFromLocalStorage();

    const [conversations, setConversations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // You can set this to 'error' for error messages

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

    const onDeleteClick = async (conversationId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete_conversation/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // The conversation was deleted successfully
                const data = await response.json();
                console.log(data.message); // You can handle the success message here
                // Show success Snackbar
                setSnackbarMessage(data.message);
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
                window.location.reload()

            } else {
                // Handle errors here
                const errorData = await response.json();
                console.error('Error:', errorData);
                // Show error Snackbar
                setSnackbarMessage('Error deleting conversation.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('An error occurred:', error);

            // Show error Snackbar
            setSnackbarMessage('An error occurred.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };
    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };


    return (
        <div>
            {/* List of conversation cards */}
            {conversations.map((conversation) => (
                <div key={conversation.id} className="border px-4 py-2 mb-4 rounded-lg w-5/6 cursor-pointer relative" onClick={() => onCardClick(conversation.id)}>
                    <div className="flex flex-col items-start">
                        <p className="text-md font-semibold">{conversation.name}</p>
                        <p className="text-sm text-gray-500">Last Updated: {formatDate(conversation.last_updated)}</p>
                    </div>
                    {/* Delete Icon */}
                    <i
                        className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-red-700"
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent card click when clicking the icon
                            onDeleteClick(conversation.id); // Replace onDeleteClick with your delete function
                        }}
                    >
                        <i className="fas fa-trash"><DeleteIcon /></i> {/* Replace with the appropriate Font Awesome icon class */}
                    </i>
                </div>
            ))}
            {/* Snackbar for status message */}
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
        </div>
    );
};

export default AllConversations;
