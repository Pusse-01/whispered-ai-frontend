import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';

import { FiUpload, FiX } from 'react-icons/fi';
import ArrowBackIosOutlinedIcon from '@mui/icons-material/ArrowBackIosOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getUserDataFromLocalStorage } from '../utils'

import { TextField, Typography, Dialog, Button, DialogContent, DialogTitle, DialogActions } from '@mui/material';


import API_BASE_URL from '../config';

const choices = [
    { title: 'Marketing' },
    { title: 'IT' },
    { title: 'Finance' },
    { title: 'Product Design' },
    { title: 'HR' },
    { title: 'Other' },
];

function FileUploader({ folder_id }) {
    const user = getUserDataFromLocalStorage();
    const [file, setFile] = useState(null);
    const [selectedTags, setSelectedTags] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/files');
    };

    const handleDrop = (event) => {
        event.preventDefault();
        // Handle file drop here
        // You can access dropped files from event.dataTransfer.files
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileInputChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleCancelClick = () => {
        setFile(null);
    };

    const handleUploadFile = () => {
        if (!file) {
            alert('Please select a file to upload.');
            return;
        }

        if (selectedTags.length === 0 && !newCategory) {
            setIsDialogOpen(true);
            return;
        }

        setIsUploading(true);
        // Convert the file to Base64 string
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            const requestBody = {
                base64String,
                folderPath: '',
                filename: file.name,
                tags: selectedTags.map((tag) => tag.title),
                userID: user._id,
                folder_id: (folder_id.folder_id)
            };
            // Make the POST request to /upload endpoint
            fetch(`${API_BASE_URL}/upload`, {
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
                        // Clear the selected file and tags after successful upload
                        setFile(null);
                        setSelectedTags([]);
                    } else {
                        setUploadStatus('File uploading Failed!');
                        setIsSnackbarOpen(true);
                    }
                })
                .catch((error) => {
                    console.error('Error uploading file:', error);
                    setUploadStatus('An error occurred while uploading the file.');
                    setIsSnackbarOpen(true);
                })
                .finally(() => {
                    setIsUploading(false);
                    window.location.reload()
                });
        };
    };

    const handleAddNewCategory = () => {
        if (newCategory.trim() === '') {
            alert('Please enter a valid category.');
            return;
        }

        const newTag = { title: newCategory.trim() };
        setSelectedTags((prevTags) => [...prevTags, newTag]);
        setNewCategory('');
        setIsDialogOpen(false);
    };

    const handleCloseSnackbar = () => {
        setIsSnackbarOpen(false);
    };

    return (
        <div className="px-4 md:px-8 py-4">
            {/* <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">File Uploader</h2>
                <button onClick={handleBack} className="text-gray hover:underline">
                    <ArrowBackIosOutlinedIcon className="py-2" />
                    Back to Library
                </button>
            </div> */}

            {/* Dialog for adding a new category */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Please add a folder category to continue!</DialogTitle>
                {/* <DialogContent>
                    <TextField
                        fullWidth
                        label="New Category"
                        variant="outlined"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                </DialogContent> */}
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    {/* <Button onClick={handleAddNewCategory}>Add Category</Button> */}
                </DialogActions>
            </Dialog>
            {isUploading && (
                <Dialog open={true}>
                    <DialogContent>
                        <div className="flex items-center justify-center">
                            <CircularProgress />
                            <Typography variant="h6" style={{ marginLeft: '8px' }}>
                                File is uploading...
                            </Typography>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

            <div className="mb-4 flex items-center justify-between mt-8">
                <label className="text-sm font-medium text-gray-700 w-1/8 mr-4">
                    Select Folder Category:
                </label>
                <Autocomplete
                    multiple
                    id="file-tags"
                    size="small"
                    options={choices}
                    sx={{ width: '65vw' }}
                    getOptionLabel={(option) => option.title}
                    defaultValue={[]}
                    value={selectedTags}
                    onChange={(event, newValue) => setSelectedTags(newValue)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            variant="standard"
                            fullWidth
                            placeholder="Add tags to select folders"
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' && event.target.value) {
                                    const newTag = { title: event.target.value };
                                    setSelectedTags((prevTags) => [...prevTags, newTag]);
                                    event.target.value = '';
                                }
                            }}
                        />
                    )}
                />
            </div>

            <div className="flex flex-col items-center justify-center mt-4 ">
                <div className="relative bg-gray-100 rounded-md w-full p-4">
                    <form>
                        <div className="flex items-center justify-center bg-white rounded-md shadow-md p-12">
                            {file ? (
                                <div>
                                    <p className="text-grey-500">{file.name} selected</p>
                                    <div className="mt-4 flex items-center justify-center">
                                        <button
                                            type="button"
                                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-4 rounded-2xl"
                                            onClick={handleCancelClick}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <label
                                        htmlFor="file-upload"
                                        className="flex flex-col items-center justify-center cursor-pointer"
                                    >
                                        <FiUpload className="text-4xl text-gray-400 mb-4" />
                                        <span className="text-gray-400">
                                            Click or drag file to upload
                                        </span>
                                        <span className="text-gray-400">
                                            Up to 100MB in size. PDF, PPT, PPTX, DOC, DOCX
                                        </span>
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileInputChange}
                                    />
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Add other file uploading inputs if needed */}
            <div className="flex justify-end mt-4">
                <button
                    onClick={handleUploadFile}
                    type="submit"
                    style={{ backgroundColor: '#1250B9' }}
                    className="hover:bg-blue-600 text-white py-1 px-4 rounded-2xl"
                >
                    Upload File
                </button>
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

export default FileUploader;
