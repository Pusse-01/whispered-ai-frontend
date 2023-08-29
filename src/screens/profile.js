import React, { useEffect, useState } from 'react';
import { getUserDataFromLocalStorage } from '../utils';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import API_BASE_URL from '../config';
import { TextField, Typography, Dialog, Button, DialogContent, DialogTitle, DialogActions } from '@mui/material';


const Profile = () => {
    const user = getUserDataFromLocalStorage();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackBarMessage, setSnackBarMessage] = useState('');


    const [input, setInput] = useState({
        name: '',
        email: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
        currentPassword: '',
    });

    const [error, setError] = useState({
        name: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
    });

    useEffect(() => {
        const apiUrl = `${API_BASE_URL}/get-user/${user.email}`; // Replace with the actual API URL
        const requestBody = {
            email: user.email
        };
        // Define the options for the fetch request
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // body: JSON.stringify(requestBody),
        };
        fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                return response.json();

            })
            .then(data => {
                console.log(data)
                data = data.user
                setInput({
                    name: data.name,
                    email: data.email,
                    password: '',
                    newPassword: '',
                    confirmNewPassword: '',
                    currentPassword: '',
                });

            })
            .catch(error => {
                setError(error);
            });
    }, []);

    const onInputChange = e => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
        validateInput(e);
    }

    const validateInput = e => {
        let { name, value } = e.target;
        setError(prev => {
            const stateObj = { ...prev, [name]: "" };

            switch (name) {
                case "name":
                    if (!value) {
                        stateObj[name] = "Please enter Name.";
                    }
                    break;

                case "password":
                    if (!value) {
                        stateObj[name] = "Please enter your Current Password.";
                    }
                    // else if (input.confirmNewPassword && value !== input.confirmNewPassword) {
                    //     stateObj["confirmNewPassword"] = "Password and Confirm New Password do not match.";
                    // } else {
                    //     stateObj["confirmNewPassword"] = input.confirmNewPassword ? "" : error.confirmNewPassword;
                    // }
                    break;

                case "newPassword":
                    if (!value) {
                        stateObj[name] = "Please enter New Password.";
                    } else if (input.confirmNewPassword && value !== input.confirmNewPassword) {
                        stateObj["confirmNewPassword"] = "New Password and Confirm New Password do not match.";
                    } else {
                        stateObj["confirmNewPassword"] = input.confirmNewPassword ? "" : error.confirmNewPassword;
                    }
                    break;

                case "confirmNewPassword":
                    if (!value) {
                        stateObj[name] = "Please enter Confirm New Password.";
                    } else if (input.newPassword && value !== input.newPassword) {
                        stateObj[name] = "New Password and Confirm New Password do not match.";
                    }
                    break;

                default:
                    break;
            }

            return stateObj;
        });
    }


    const saveProfileHandler = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: input.name,
                    email: input.email,
                    password: user.password,
                    current_password: input.password, // Use the current password field
                    new_password: input.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage(data.message);
                setErrorMessage('');
            } else {
                setSuccessMessage('');
                setErrorMessage(data.detail || 'An error occurred while saving the profile.');
            }
        } catch (error) {
            setSuccessMessage('');
            setErrorMessage('An error occurred while saving the profile.');
        } finally {
            setLoading(false);
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <div className='w-3/4 mx-auto p-4'>
            <h1 className='text-left text-xl'>Profile</h1>
            <div className='text-left mt-4'>
                <div className="flex items-center mb-4">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700 mr-4">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={input.name}
                        onChange={onInputChange}
                        onBlur={validateInput}
                        className="mt-1 px-4 py-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />

                </div>
                {error.name && <span className='text-sm text-red-500'>{error.name}</span>}
                <div className="flex items-center mb-4">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 mr-4">
                        Email
                    </label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={input.email}
                        className="mt-1 px-4 py-2 block w-full border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        readOnly
                    />
                </div>
                <div className="flex items-center mt-4">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700 mr-4">
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={input.password}
                        onChange={onInputChange}
                        onBlur={validateInput}
                        className="mt-1 px-4 py-2 block border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                {error.password && <span className='text-sm text-red-500'>{error.password}</span>}
                <div className="flex items-center mt-4">
                    <label htmlFor="newPassword" className="text-sm font-medium text-gray-700 mr-4">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={input.newPassword}
                        onChange={onInputChange}
                        onBlur={validateInput}
                        className="mt-1 px-4 py-2 block border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />

                </div>
                {error.newPassword && <span className='text-sm text-red-500'>{error.newPassword}</span>}
                <div className="flex items-center mt-4">
                    <label htmlFor="confirmNewPassword" className="text-sm font-medium text-gray-700 mr-4">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        value={input.confirmNewPassword}
                        onChange={onInputChange}
                        onBlur={validateInput}
                        className="mt-1 px-4 py-2 block border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        required
                    />

                </div>
                {error.confirmNewPassword && <span className='text-sm text-red-500'>{error.confirmNewPassword}</span>}
            </div>
            <div className="flex justify-end mt-4">
                <button
                    type="submit"
                    style={{ backgroundColor: '#1250B9' }}
                    className="hover:bg-blue-600 text-white px-4 py-1 rounded-2xl mt-6"
                    onClick={saveProfileHandler}
                >
                    {loading ? (<CircularProgress size={'30'} className="mx-2" />) : ('Save')}
                </button>

            </div>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <div>
                    {successMessage && (
                        <div>
                            <MuiAlert
                                elevation={6}
                                variant="filled"
                                onClose={handleSnackbarClose}
                                severity="success"
                            >
                                {successMessage}
                            </MuiAlert>
                        </div>
                    )}
                    {errorMessage && (
                        <div>
                            <MuiAlert
                                elevation={6}
                                variant="filled"
                                onClose={handleSnackbarClose}
                                severity="error"
                            >
                                {errorMessage}
                            </MuiAlert>
                        </div>
                    )}
                </div>

            </Snackbar>

        </div>
    );
};

export default Profile;
