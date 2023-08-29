import { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const SignupForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState({
        name: '',
        email: '',
        password: '',
        newPassword: '',
        confirmNewPassword: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);


    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const validateInput = e => {
        let { name, value } = e.target;
        setError(prev => {
            const stateObj = { ...prev, [name]: "" };

            switch (name) {
                case "name":
                    if (!value) {
                        stateObj[name] = "Please enter your Name.";
                    }
                    break;


                case "email":
                    if (!value) {
                        stateObj[name] = "Please enter your Email.";
                    }
                    break;

                case "password":
                    if (!value) {
                        stateObj[name] = "Please enter your Password.";
                    }
                    break;
                default:
                    break;
            }
            return stateObj;
        });
    }

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Perform login logic by sending data to the backend
        fetch(`${API_BASE_URL}/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                username: email,
                password: password,

            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('User already Exist!');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data)
                localStorage.setItem('user', JSON.stringify(data.user));
                // Login successful, handle the response data (e.g., save the token, update state, etc.)
                handleLogin();
            })
            .catch((error) => {
                console.error(error.message);
                setErrorMessage(error.message || 'Signup Failed!')
                // Handle login error (e.g., display error message)
            }).finally(() => {
                setSnackbarOpen(true);
            })
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };
    return (
        <div>
            <form onSubmit={handleFormSubmit} className="mb-8" action="#">
                <div className="form-control w-full text-left">
                    <div className='items-center mb-4 text-left'>
                        <label className="label">
                            <span className="form-label label-text text-left">Name</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={handleNameChange}
                            onBlur={validateInput}
                            className="my-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md px-2"
                            required
                        />
                        {error.name && <span className='text-sm text-red-500'>{error.name}</span>}

                    </div>
                    <div className='items-center mb-4 text-left'>
                        <label className="label">
                            <span className="form-label label-text">Email</span>
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            onBlur={validateInput}
                            className="my-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md px-2"
                            required
                        />
                        {error.email && <span className='text-sm text-red-500'>{error.email}</span>}

                    </div>
                    <div>
                        <label className="label">
                            <span className="form-label label-text">Password</span>
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={validateInput}
                            className="my-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md px-2"
                            required
                        />
                        {error.password && <span className='text-sm text-red-500'>{error.password}</span>}

                    </div>
                    <button className="btn bg-blue-800 btn-block px-2 py-1 rounded-md text-white text-sm">Signup </button>
                </div>
            </form>
            <p className="mt-5 text-txt-blue-grey">
                Already have an account?{' '}
                <Link to="/login" className="text-main-accent">
                    Login
                </Link>
            </p>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <div>
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

export default SignupForm;