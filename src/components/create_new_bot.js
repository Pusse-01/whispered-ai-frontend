import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';

import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { TextField, Typography, Dialog, Button, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { getUserDataFromLocalStorage } from '../utils'
import TextareaAutosize from '@mui/material/TextareaAutosize';

import { API_BASE_URL } from '../config';


const CreateBotForm = () => {
    const user = getUserDataFromLocalStorage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [botData, setBotData] = useState({
        name: '',
        description: '',
        specialty: null,
        folders: [],
        logo_image: '',
    });
    const [files, setFiles] = useState([]);
    const [isPromptDialogOpen, setIsPromptDialogOpen] = useState(false);
    const [promptText, setPromptText] = useState('');
    const [systemPrompt, setSystemPrompt] = useState('');
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);


    const handlePromptSave = () => {
        // Handle saving prompt text
        setIsPromptDialogOpen(false);
    };
    // Dummy data for the tags
    const choices = [
        { title: 'Factual' },
        { title: 'Creative' },
        // { title: 'Training' },
        { title: 'HR' },
        { title: 'IT Support' },
        // { title: 'Custom Support' },
        { title: 'Marketing' },
        // Add more tags if needed
    ];

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/folders/${user._id}`);
                if (response.ok) {
                    const filesData = await response.json();
                    const allFilesChoice = { name: 'Select All' };
                    setFiles([allFilesChoice, ...filesData.folders]);
                } else {
                    throw new Error('Failed to fetch files.');
                }
            } catch (error) {
                console.error('Error fetching files:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    console.log(files)
    const handleBack = () => {
        // Navigate back to the files page
        navigate('/chatbot');
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        // if (botData.specialty === null && (promptText.trim() === '' || systemPrompt.trim() === '')) {
        //     setIsErrorDialogOpen(true);
        //     return;
        // }
        const foldersToSend = botData.folders.map((folderItem) => folderItem.name);

        // if (foldersToSend.includes('Select All')) {
        //     foldersToSend = ['all'];
        // }

        console.log(foldersToSend)

        const specialtyTitles = botData.specialty ? [botData.specialty].map(item => item.title) : [];
        console.log(botData.specialty)
        setLoading(true);
        const botCreateData = {
            name: botData.name,
            description: botData.description,
            specialty: specialtyTitles,
            promptText: promptText,
            systemPrompt: promptText,
            folders: foldersToSend,
            logo_image: botData.logo_image,
            user_id: user._id,
            saved_time: new Date().toISOString(),
            chats: [],
        };
        console.log(botCreateData)

        // Assuming you have an API function to create a new bot, replace API_BASE_URL with your actual API base URL
        try {
            const response = await fetch(`${API_BASE_URL}/create_bot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(botCreateData),
            });

            if (response.ok) {
                setSnackBarMessage('Bot created successfully!');
                setBotData({
                    name: '',
                    description: '',
                    specialty: [],
                    folders: [],
                    logo_image: '',
                });
            } else {
                setSnackBarMessage('Bot creation failed!');
            }
        } catch (error) {
            console.error('Error creating bot:', error);
            setSnackBarMessage('Bot creation failed!');
            // setLoading(false);
        }

        setLoading(false);
        setOpenSnackBar(true);
    };

    const handleSnackBarClose = () => {
        setOpenSnackBar(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBotData({ ...botData, [name]: value });
    };

    return (
        <div
            style={{ width: '80vw' }
            }
            className="container mx-auto py-8" >
            <div className="flex justify-between mb-8">
                <h2 className="text-2xl font-bold">Create New Bot</h2>
                <button
                    onClick={handleBack}
                    className="text-gray hover:underline"
                >
                    <ArrowBackIosOutlinedIcon className='py-2' />
                    Back to Bots
                </button>
            </div>
            {/* <h2 className="text-2xl font-bold mb-4">Create New Bot</h2> */}
            <form className="w-full mx-auto" onSubmit={handleFormSubmit}>
                <div className="flex items-center mb-4">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mr-4">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={botData.name}
                        onChange={handleInputChange}
                        className="mt-1 px-4 py-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter bot name"
                        required
                    />
                </div>
                <div className="flex items-center mb-4">
                    <label
                        htmlFor="description"
                        className="text-sm font-medium text-gray-700 mr-4"
                    >
                        Description
                    </label>
                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={botData.description}
                        onChange={handleInputChange}
                        className="mt-1 px-4 py-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Enter bot description"
                        required
                    />
                </div>
                <div className="flex items-center justify-between mb-4 w-full">
                    <label className="text-sm font-medium text-gray-700 mr-4">
                        Personality:
                    </label>
                    <Autocomplete

                        id="bot-tags"
                        size="small"
                        options={choices}
                        sx={{ width: '65vw' }}
                        getOptionLabel={(option) => option.title}
                        value={botData.specialty || []}
                        onChange={(event, newValue) => {
                            setBotData({ ...botData, specialty: newValue });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                                placeholder="Add tags to select folders"
                            />
                        )}
                    />
                    <button
                        className="text-blue-600"
                        onClick={(e) => {
                            e.preventDefault();
                            setIsPromptDialogOpen(true)
                        }}
                    >
                        Advanced Prompt
                    </button>
                </div>


                {files.length > 0 && (
                    <div className="flex items-center justify-between mb-4 w-full">
                        <label className="text-sm font-medium text-gray-700 mr-4">
                            Folders:
                        </label>
                        <Autocomplete
                            multiple
                            id="bot-files"
                            size="small"
                            options={files}
                            sx={{ width: '65vw' }}
                            getOptionLabel={(option) => option.name}
                            value={botData.folders}
                            onChange={(event, newValue) => {
                                setBotData({ ...botData, folders: newValue });
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    fullWidth
                                    placeholder="Select files"
                                />
                            )}
                        />
                    </div>)}
                {/* <div className="flex items-center justify-between mb-4">
                    <label htmlFor="logo" className="text-sm font-medium text-gray-700">
                        Logo Image
                    </label>
                    <input
                        type="file"
                        id="logo"
                        name="logo"
                        accept="image/*"
                        className="mt-1 block"
                        required
                    />
                </div> */}
                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        style={{ backgroundColor: '#1250B9' }}
                        className="hover:bg-blue-600 text-white px-4 py-1 rounded-2xl mt-6"
                    >
                        Create Bot
                    </button>
                </div>
                {/* Advanced Prompt Dialog */}
                <Dialog
                    fullWidth='true'
                    maxWidth='md'
                    open={isPromptDialogOpen} onClose={() => setIsPromptDialogOpen(false)}>
                    <DialogTitle>Advanced Prompt</DialogTitle>
                    <DialogContent>
                        <p className='text-gray-500'>This is your main control panel. Here you provide detailed instructions that directly guide the behavior and output of your AI bot. </p>
                        <TextareaAutosize
                            aria-label="Prompt"
                            minRows={3}
                            variant="outlined"
                            placeholder="Enter your prompt here"
                            value={promptText}
                            onChange={(e) => setPromptText(e.target.value)}
                            style={{
                                width: '100%',
                                resize: 'vertical',
                                border: '1px solid gray', // Add a gray border
                                borderRadius: '5px',      // Add border radius for rounded corners
                                padding: '8px'           // Add padding for spacing inside the textarea
                            }}
                        />
                        <div className='mt-4'></div>
                        {/* <p className='text-gray-500'>This is where you set the general 'mood' or 'character' for your AI bot. It's like giving it a personality, but its influence on the bot's responses is gentler.</p>
                        <TextField
                            label="System Prompt"
                            variant="outlined"
                            fullWidth
                            value={systemPrompt}
                            onChange={(e) => setSystemPrompt(e.target.value)}
                        /> */}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsPromptDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePromptSave} color="primary">Save</Button>
                    </DialogActions>
                </Dialog>
                {/* <Dialog open={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}>
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Please add Prompt texts here. Make sure to give the clear instructions on the specialty of the bot!</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsErrorDialogOpen(false)}>OK</Button>
                    </DialogActions>
                </Dialog> */}

            </form>
            {/* Loading spinner */}
            {loading && (
                <div className="flex justify-center mt-4">
                    <CircularProgress color="primary" />
                </div>
            )}

            {/* Snackbar for success/failure messages */}
            <Snackbar
                open={openSnackBar}
                autoHideDuration={3000}
                onClose={handleSnackBarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    onClose={handleSnackBarClose}
                    severity={snackBarMessage.includes('success') ? 'success' : 'error'}
                >
                    {snackBarMessage}
                </MuiAlert>
            </Snackbar>
        </div >
    );
};

export default CreateBotForm;

