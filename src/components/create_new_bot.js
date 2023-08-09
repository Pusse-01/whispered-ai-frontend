import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getUserDataFromLocalStorage } from '../utils'

import API_BASE_URL from '../config';


const CreateBotForm = () => {
    const user = getUserDataFromLocalStorage();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');
    const [botData, setBotData] = useState({
        name: '',
        description: '',
        specialty: [],
        folders: [],
        logo_image: '',
    });
    const [files, setFiles] = useState([]);


    // Dummy data for the tags
    const choices = [
        { title: 'Marketing' },
        { title: 'HR' },
        { title: 'IT' },
        { title: 'Designing' },
        { title: 'Finance' },
        { title: 'All' },
        // Add more tags if needed
    ];

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/files/${user._id}`);
                if (response.ok) {
                    const filesData = await response.json();
                    setFiles(filesData);
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
        setLoading(true);
        const botCreateData = {
            name: botData.name,
            description: botData.description,
            specialty: botData.specialty.map((specialtyItem) => specialtyItem.title),
            folders: botData.folders.map((folderItem) => folderItem.file_name),
            logo_image: botData.logo_image,
            user_id: user._id,
            saved_time: new Date().toISOString(),
            chats: [],
        };


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

                <div className="flex items-center justify-between mb-4  w-full">
                    <label className="text-sm font-medium text-gray-700 mr-4">
                        Specialty:
                    </label>
                    <Autocomplete
                        multiple
                        id="bot-tags"
                        size="small"
                        options={choices}
                        sx={{ width: '65vw' }}
                        getOptionLabel={(option) => option.title}
                        value={botData.specialty}
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
                </div>
                {files.length > 0 && (
                    <div className="flex items-center justify-between mb-4 w-full">
                        <label className="text-sm font-medium text-gray-700 mr-4">
                            Files:
                        </label>
                        <Autocomplete
                            multiple
                            id="bot-files"
                            size="small"
                            options={files}
                            sx={{ width: '65vw' }}
                            getOptionLabel={(option) => option.file_name}
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

