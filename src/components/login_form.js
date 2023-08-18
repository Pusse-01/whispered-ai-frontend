import { useState } from 'react';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config';

const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        // Perform login logic by sending data to the backend
        fetch(`${API_BASE_URL}/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Invalid credentials');
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
                // Handle login error (e.g., display error message)
            });
    };

    return (
        <div>
            <form onSubmit={handleFormSubmit} className="mb-8" action="#">
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="form-label label-text">Username</span>
                    </label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        className="my-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md px-2"
                        required
                    />
                    <label className="label">
                        <span className="form-label label-text">Password</span>
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="my-2 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-md border-gray-300 rounded-md px-2"
                        required
                    />
                    <button className="btn bg-blue-800 btn-block px-2 py-1 rounded-md text-white text-sm">Log in </button>
                </div>
            </form>
            <p className="mt-5 text-txt-blue-grey">
                Dont have an account yet?{' '}
                <Link to="/signup" className="text-main-accent">
                    Sign up
                </Link>
            </p>
        </div>
    );
};

export default LoginForm;