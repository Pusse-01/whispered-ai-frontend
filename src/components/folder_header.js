import React, { useState } from 'react';
import {
    useNavigate
} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/Filter';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import { TextField, Typography, Dialog, Button, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { getUserDataFromLocalStorage } from '../utils'
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import API_BASE_URL from '../config';

function FolderHeader() {
    const user = getUserDataFromLocalStorage();
    const [folderCreateDialog, setFormOpen] = useState(false)
    const [folderName, setFolderName] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const navigate = useNavigate();

    const handleAddFile = () => {
        setFormOpen(true)
    };

    const handleFolderNameChange = event => {
        setFolderName(event.target.value);
    };


    const handleSave = () => {
        const requestBody = {
            name: folderName,
            files: [],
            // created: '',
            user_id: user._id
        };
        setIsUploading(true);

        fetch(`${API_BASE_URL}/create_folder`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (response.ok) {
                    setUploadStatus('File uploaded successfully!');
                    setIsSnackbarOpen(true);

                } else {
                    setUploadStatus('File uploading Failed!');
                    setIsSnackbarOpen(true);
                }
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
                setUploadStatus('An error occurred while uploading the file.');
                setIsSnackbarOpen(true);
            }).finally(() => {
                setIsUploading(false);
                window.location.reload()
            });

    }

    const handleCloseSnackbar = () => {
        setIsSnackbarOpen(false);
    };

    return (
        <div>
            <Dialog open={folderCreateDialog} onClose={() => setFormOpen(false)}>
                <DialogTitle>Create new folder</DialogTitle>
                <DialogContent>
                    <div className="flex items-center mb-4">
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 mr-4">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={folderName}
                            onChange={handleFolderNameChange}
                            className="mt-1 px-4 py-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Enter Folder name"
                            required
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
            {isUploading && (
                <Dialog open={true}>
                    <DialogContent>
                        <div className="flex items-center justify-center">
                            <CircularProgress />
                            <Typography variant="h6" style={{ marginLeft: '8px' }}>
                                Folder is creating...
                            </Typography>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
            {/* Container */}
            <div
                className="flex justify-between items-center mb-4"
            >
                <div className="text-2xl font-bold">Folder Library</div>
                <Button
                    variant="contained"
                    startIcon={<ControlPointOutlinedIcon />}
                    style={{ backgroundColor: '#1250B9' }}
                    className="text-white ml-4 rounded-xl"
                    onClick={handleAddFile}
                >
                    New Folder
                </Button>
            </div>

            {/* Row */}
            <div

                className="flex justify-center mb-4">
                <TextField
                    variant="outlined"
                    placeholder="Search file"
                    InputProps={{ startAdornment: <SearchIcon /> }}
                    className="pr-4 md:pr-8 w-full"
                />
                {/* <Button
                    // onClick={handleSearch}
                    // style={{ backgroundColor: '#0C0F35' }}
                    // variant="outlined"
                    startIcon={<FilterIcon />}
                    className=" px-4 py-2 rounded-r "
                >
                    Filter
                </Button> */}
            </div>
            {/* Snackbar for showing alerts */}
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
            >
                <MuiAlert
                    onClose={handleCloseSnackbar}
                    severity={uploadStatus.includes('success') ? 'success' : 'error'}
                    elevation={6}
                    variant="filled"
                >
                    {uploadStatus}
                </MuiAlert>
            </Snackbar>
        </div>
    );
}


export default FolderHeader;
