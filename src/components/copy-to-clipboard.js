import React, { useState, useEffect } from 'react';

function CopyLinkToClipboard({ link }) {
    const [isCopied, setIsCopied] = useState(false);
    const linkToCopy = link

    const copyToClipboard = () => {
        console.log(linkToCopy)
        const textField = document.createElement('textarea');
        textField.innerText = linkToCopy;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        setIsCopied(true);
    };



    useEffect(() => {
        if (isCopied) {
            // After copying, reset the "Copied!" state after a brief delay
            const resetTimeout = setTimeout(() => {
                setIsCopied(false);
            }, 2000);

            return () => {
                clearTimeout(resetTimeout);
            };
        }
    }, [isCopied]);

    return (
        <div className="py-4 rounded-md">
            {/* <p className="text-gray-700 mb-2">Click the button to copy the link:</p> */}
            <div className="flex text-white">
                <input
                    type="text"
                    value={linkToCopy}
                    readOnly
                    className="flex-grow bg-[#1E293B] border border-gray-300 rounded-l-md p-2 focus:outline-none"
                />
                <button
                    onClick={copyToClipboard}
                    className="bg-blue-500 hover:bg-blue-700 text-white rounded-r-md p-2"
                >
                    {isCopied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>
        </div>
    );
}

export default CopyLinkToClipboard;
