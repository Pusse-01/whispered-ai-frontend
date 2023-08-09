import React from 'react';
import logo from '../assets/logo.png';
import SignupForm from '../components/signup_form';
const Signup = ({ handleSignup }) => {
    return (
        <div className="h-screen grid grid-cols-2">
            <div className="bg-gray-500 flex items-center justify-start">
                <div className="m-auto">
                    <img className="m-auto" src={logo} alt="Logo" width="200" height="100" />
                    {/* <h1 className="text-white font-bold text-4xl my-8">
                        INSUREPULSE
                    </h1> */}
                    <p className="mt-4 text-white text-xs">
                        Powered by Synacal
                    </p>
                </div>
            </div>
            <div
                className="place-items-start m-auto px-16"
                style={{ width: '40vw' }}>
                {/* <h1 className="text-black-200 font-bold text-xl mb-2">Hello!</h1> */}
                <p className="text-txt-blue-grey">
                    Welcome to Whispered AI, Please Signup to continue...
                </p>
                <div>
                    <SignupForm handleSignup={handleSignup} />
                </div>
            </div>
        </div>

    );
};

export default Signup;