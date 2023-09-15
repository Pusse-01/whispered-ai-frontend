import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatIcon from '@mui/icons-material/Chat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ShareIcon from '@mui/icons-material/Share';
import Tag from './tag';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress from Material-UI
import { getUserDataFromLocalStorage } from '../utils'
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../config';

const BotsTable = () => {
    const user = getUserDataFromLocalStorage();
    const [anchorEl, setAnchorEl] = useState(null);
    const [botsData, setBotsData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedBot, setSelectedBot] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedBot, setEditedBot] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        // Fetch data from the endpoint
        fetch(`${API_BASE_URL}/get_bots/${user._id}`)
            .then((response) => response.json())
            .then((data) => {
                setBotsData(data);

                console.log(data)
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                // Handle error here, e.g., show an error message on the UI
            });
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNewConversation = async (botId, specialty, documents) => {
        try {
            setIsLoading(true);
            const currentDate = new Date().toISOString().split('T')[0];
            const response = await fetch(`${API_BASE_URL}/create_new_chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bot_id: botId,
                    messages: [],
                    specialty: specialty,
                    documents: documents,
                    userID: user._id,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create conversation');
            }
            const data = await response.json();
            console.log(data);
            const chatID = data.id;
            setIsLoading(false);
            // setSelectedItem('newConversations');
            navigate(`/chats/${chatID}`); // Navigate to the newly created conversation
        } catch (error) {
            console.error('Error creating conversation:', error);
            setIsLoading(false);
            // Handle error here, e.g., show an error message on the UI
        }
    };

    const handleShareClick = async (botId, specialty, documents) => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/create_new_chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bot_id: botId,
                    messages: [],
                    specialty: specialty,
                    documents: documents,
                    userID: user._id,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create conversation');
            }
            const data = await response.json();
            const chatID = data.id;
            setIsLoading(false);
            navigate(`/share/${chatID}`); // Navigate to the newly created conversation
        } catch (error) {
            console.error('Error creating conversation:', error);
            setIsLoading(false);
            // Handle error here, e.g., show an error message on the UI
        }
    }

    const handleEditClick = (bot) => {
        setSelectedBot(bot);
        setEditedBot(bot);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditDialogOpen(false);
        setEditedBot({});
    };

    const handleEditSave = async () => {
        try {
            setIsEditing(true);
            const response = await fetch(`${API_BASE_URL}/edit_bot/${editedBot.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedBot),
            });

            if (!response.ok) {
                throw new Error('Failed to edit bot');
            }

            // Update botsData with edited bot
            const updatedBotsData = botsData.map(bot => (bot.id === editedBot.id ? editedBot : bot));
            setBotsData(updatedBotsData);

            setIsEditing(false);
            setEditDialogOpen(false);

            // Show success popup
            // You can use your preferred notification library for this
            alert('Bot Edited successfully!');
        } catch (error) {
            console.error('Error editing bot:', error);
            setIsEditing(false);
        }
    };

    const handleDeleteClick = (bot) => {
        setSelectedBot(bot);
        setDeleteConfirmationOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete_bot/${selectedBot.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete bot');
            }

            // Remove deleted bot from botsData
            const updatedBotsData = botsData.filter(bot => bot.id !== selectedBot.id);
            setBotsData(updatedBotsData);

            setDeleteConfirmationOpen(false);

            // Show success popup
            // You can use your preferred notification library for this
            alert('Bot Deleted successfully!');
        } catch (error) {
            console.error('Error deleting bot:', error);
        }
    };


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


    return (
        <>
            {
                isLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                        <CircularProgress />
                    </div>
                ) : (<TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Specialty</TableCell>
                                <TableCell>Created on</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {botsData.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {/* Place your icon here */}
                                    </TableCell>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    {/* <TableCell>{item.description}</TableCell> */}
                                    <TableCell>
                                        {/* Display items in the 'specialty' data as tags */}
                                        {item.specialty.map((tag, index) => (
                                            <Tag key={index} text={tag} />
                                        ))}
                                    </TableCell>
                                    <TableCell>{formatDate(item.saved_time)}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={handleClick}>
                                            <MoreVertIcon />
                                        </IconButton>
                                        <Menu
                                            anchorEl={anchorEl}
                                            open={Boolean(anchorEl)}
                                            onClose={handleClose}
                                        >
                                            <MenuItem onClick={() => {
                                                handleClose();
                                                handleNewConversation(
                                                    item.id, // Bot ID
                                                    item.specialty, // Specialty
                                                    item.folders // Documents
                                                );
                                            }}>
                                                <ChatIcon sx={{ marginRight: 1 }} />
                                                Chat
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                handleClose();
                                                handleEditClick(item);
                                            }}>
                                                <EditIcon sx={{ marginRight: 1 }} />
                                                Edit
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                handleClose();
                                                handleDeleteClick(item);
                                            }}>
                                                <DeleteIcon sx={{ marginRight: 1 }} />
                                                Delete
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => {
                                                    handleClose();
                                                    handleShareClick(
                                                        item.id, // Bot ID
                                                        item.specialty, // Specialty
                                                        item.folders // Documents
                                                    );
                                                }}

                                            >
                                                <ShareIcon sx={{ marginRight: 1 }} />
                                                Share
                                            </MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>)}
            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Bot</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        value={editedBot.name || ''}
                        onChange={(e) => setEditedBot({ ...editedBot, name: e.target.value })}
                        fullWidth
                        style={{ marginBottom: '1rem' }}
                    />
                    {/* <div className='mt-4'></div> */}
                    <TextField
                        label="Description"
                        value={editedBot.description || ''}
                        onChange={(e) => setEditedBot({ ...editedBot, description: e.target.value })}
                        fullWidth
                    />
                    {/* Add more fields as needed */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="primary" disabled={isEditing}>
                        {isEditing ? <CircularProgress size={24} /> : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Bot Confirmation */}
            <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this bot?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirmationOpen(false)} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="primary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BotsTable;
