import React, { useState } from 'react';
import CopyLinkToClipboard from './copy-to-clipboard';
import { useParams } from 'react-router-dom';
import { Divider } from '@mui/material';
import { FE_URL } from '../config';

function ChatbotCustomizer() {
    const [headerLayout, setHeaderLayout] = useState('left');
    const [logoImage, setLogoImage] = useState(null); // Store the selected logo image file
    const [headerBackgroundColor, setHeaderBackgroundColor] = useState('#1d4ed8');
    const [title, setTitle] = useState('Chatbot');
    const [subtitle, setSubtitle] = useState('Your Virtual Assistant');
    const [botMessage, setBotMessage] = useState('Hello, what can I do for you?')
    const [humanMessage, setHumanMessage] = useState('Hello Whispered, This is a preview.')
    const [messageSize, setMessageSize] = useState('medium');
    const [chatBackgroundColor, setChatBackgroundColor] = useState('#fff');
    const [botInitialMessages, setBotInitialMessages] = useState('Hello');
    const [botMessageBackground, setBotMessageBackground] = useState('#D3D3D3');
    const [humanMessageBackground, setHumanMessageBackground] = useState('#1d4ed8');
    const [composerPlaceholder, setComposerPlaceholder] = useState('Type your message...');
    const [sendButtonText, setSendButtonText] = useState('Send');
    const [removeBranding, setRemoveBranding] = useState(false);
    const [launcherSize, setLauncherSize] = useState('medium');
    const [screenPosition, setScreenPosition] = useState('bottom-right');
    const [launcherBackgroundColor, setLauncherBackgroundColor] = useState('#007bff');
    const [launcherIcon, setLauncherIcon] = useState(null); // Store the selected launcher icon file
    const [closeIcon, setCloseIcon] = useState(null); // Store the selected close icon file
    const [previewText, setPreviewText] = useState('Hello');
    const [suggestedQuestions, setSuggestedQuestions] = useState('Ask me something');
    const { chatID } = useParams()
    const [embedOption, setEmbedOption] = useState('inline')

    // State to control the visibility of the chatbot preview popup
    const [isPreviewOpen, setPreviewOpen] = useState(false);

    // Function to toggle the chatbot preview popup
    const togglePreview = () => {
        setPreviewOpen(!isPreviewOpen);
    };

    const headerStyle = {
        backgroundColor: `${headerBackgroundColor}`,
        textAlign: headerLayout
    };

    const chatMessageStyle = {
        backgroundColor: `${humanMessageBackground}`
    }

    const botMessageStyle = {
        backgroundColor: `${botMessageBackground}`
    }
    console.log(headerBackgroundColor)

    // Function to generate the iframe code
    const generateIframeCode = () => {
        // Create an object to hold all the customization options
        const customizationOptions = {
            headerLayout,
            headerBackgroundColor,
            title,
            subtitle,
            botMessage,
            botMessageBackground,
            humanMessage,
            humanMessageBackground,
            composerPlaceholder,
            sendButtonText,
            launcherSize,
            screenPosition,
            launcherBackgroundColor,
            // Add other customization options here...
        };

        // Generate the iframe code with the customization options
        const iframeCode = `
    <iframe src="https://your-chatbot-url.com"
      style="border: none; width: 100%; height: 400px;">
    </iframe>
    <script>
      const customizationOptions = ${JSON.stringify(customizationOptions)};

      // Access the chatbot container within the iframe
      const iframe = document.querySelector('iframe');
      const chatbotContainer = iframe.contentDocument.querySelector('#chatbot-container');

      // Apply customization options to the chatbot
      chatbotContainer.style.backgroundColor = customizationOptions.headerBackgroundColor;
      chatbotContainer.querySelector('.chatbot-title').innerText = customizationOptions.title;
      chatbotContainer.querySelector('.chatbot-subtitle').innerText = customizationOptions.subtitle;
      chatbotContainer.querySelector('.bot-message').innerText = customizationOptions.botMessage;
      chatbotContainer.querySelector('.bot-message').style.backgroundColor =
        customizationOptions.botMessageBackground;
      chatbotContainer.querySelector('.human-message').innerText = customizationOptions.humanMessage;
      chatbotContainer.querySelector('.human-message').style.backgroundColor =
        customizationOptions.humanMessageBackground;
      chatbotContainer.querySelector('.composer-input').placeholder =
        customizationOptions.composerPlaceholder;
      chatbotContainer.querySelector('.send-button').innerText = customizationOptions.sendButtonText;
      chatbotContainer.querySelector('.launcher').style.width =
        customizationOptions.launcherSize === 'small' ? '32px' :
        customizationOptions.launcherSize === 'medium' ? '48px' :
        customizationOptions.launcherSize === 'large' ? '64px' : '48px';
      chatbotContainer.querySelector('.launcher').style.backgroundColor =
        customizationOptions.launcherBackgroundColor;

      // Implement code to apply other customization options here...

    </script>
  `;

        // Display the iframe code to the user or send it to the server for storage
        console.log(iframeCode);
    };

    const iframeLink = `<iframe src="${FE_URL}/widget/64fe0cd6ead8f7cafb44bf69" style="border:0px;" name="whisperedai" scrolling="no" frameborder = "1" marginheight = "0" marginwidth = "0" height = "800px" width = "100%" allowfullscreen ></iframe >`
    const popuplink = ` <script>
        function initializeChatbot() {
            var chatbotContainer = document.getElementById("chatbot-container");
            var chatbotFrame = document.createElement("iframe");
            chatbotFrame.style.border = "0";
            chatbotFrame.style.width = "100%";
            chatbotFrame.style.height = "800px";
            chatbotFrame.allowFullscreen = true;
            chatbotFrame.src = "${FE_URL}/widget/64fe0cd6ead8f7cafb44bf69";
            chatbotContainer.appendChild(chatbotFrame);
        }
        window.addEventListener("load", function () {
            initializeChatbot();
        });
    </script>`


    return (
        <>
            <div className='text-left ml-20 mt-4 p-4'>
                <h1 className='text-md font-bold '> Share Link</h1>
                <p className='text-gray-500'>When this link is enabled, you can have anyone use this bot by visiting this link.</p>
                <CopyLinkToClipboard link={`${FE_URL}/widget/` + chatID} />

            </div>
            <Divider />
            <div className='text-left ml-20 mt-4 p-4'>
                <h1 className='text-md font-bold '> Embed</h1>
                <div className="flex rounded-lg p-1 bg-gray-200 ">

                    <button
                        className={`${embedOption === 'inline' ? 'bg-white text-black' : ' text-black'
                            } w-1/2 py-2 px-4 rounded-md flex justify-center`}

                        onClick={() => setEmbedOption('inline')}
                    >
                        {/* <img src={profImg} alt="Professor" className="icon px-2" /> */}
                        Inline Embed
                    </button>

                    <button
                        className={`${embedOption === 'popup' ? 'bg-white text-black' : ' text-black'
                            } w-1/2 py-2 px-4 rounded-md flex justify-center`}
                        onClick={() => setEmbedOption('popup')}
                    >
                        {/* Add an icon here */}
                        {/* <img src={studentImg} alt="Student" className="icon px-2" /> */}
                        Pop-Up Embed
                    </button>
                </div>
                {(embedOption === 'inline') ? (<>
                    <p className='text-gray-500'>To get the widget to appear on your webpage simply copy and paste the snippet below somewhere in the body tag. </p>
                    <CopyLinkToClipboard link={iframeLink} />
                </>) :
                    (<>
                        <p className='text-gray-500'>To get the widget to appear on your web app simply copy and paste the snippet below before the closing `head` tag on every page where you want the widget to appear for website visitors.</p>
                        <CopyLinkToClipboard link={popuplink} />
                    </>)}

            </div >

            <Divider />
            <div className='static h-screen'>
                <div className="flex h-screen">
                    {/* Left Part (Scrollable) */}
                    <div className="w-1/2 p-4 border-l flex-1 overflow-y-auto scrollbar-hide">
                        {/* Customization Options */}

                        <div className="mb-8 text-left ml-20 ">
                            {/* Header Layout */}
                            <p className='text-left mb-8 font-bold'>Customize</p>
                            <label className="block font-bold mb-2">Header</label>
                            <p className='text-gray-500'>Layout</p>
                            <div className="mb-4">
                                <label className="inline-flex items-center">
                                    <input
                                        type="radio"
                                        value="left"
                                        checked={headerLayout === 'left'}
                                        onChange={() => setHeaderLayout('left')}
                                        className="form-radio text-blue-500"
                                    />
                                    <span className="ml-2">
                                        <div className='w-32 rounded-md bg-white border items-left p-2 my-auto justify-center'>
                                            <p className='my-auto text-gray-400'>Title</p>
                                            <p className='my-auto text-gray-400'>Sub title</p>
                                        </div>
                                    </span>
                                </label>
                                <label className="inline-flex items-center ml-4">
                                    <input
                                        type="radio"
                                        value="center"
                                        checked={headerLayout === 'center'}
                                        onChange={() => setHeaderLayout('center')}
                                        className="form-radio text-blue-500"
                                    />
                                    <span className="ml-2">
                                        <div className='w-32 rounded-md bg-white border text-center p-2 my-auto justify-center'>
                                            <p className='my-auto text-gray-400'>Title</p>
                                            <p className='my-auto text-gray-400'>Sub title</p>
                                        </div>
                                    </span>
                                </label>
                            </div>

                            {/* Logo */}
                            {/* <label className="block font-bold mb-2">Logo</label>
                    <input
                        type="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => setLogoImage(e.target.files[0])}
                        className="mb-4"
                    /> */}

                            {/* Background Color */}
                            <label className="block text-gray-500 mb-2">Background Color</label>
                            <div className="rounded-2xl flex items-center">
                                {/* Color Input */}
                                <p className="text-xs text-gray-500 mr-4 py-auto">{headerBackgroundColor}</p>
                                <input
                                    type="color"
                                    value={headerBackgroundColor}
                                    onChange={(e) => setHeaderBackgroundColor(e.target.value)}
                                />
                            </div>


                            {/* Title */}
                            <label className="block text-gray-500 mb-2 mt-4">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-5/6 mb-4 p-2 border border-gray-300 rounded"
                            />

                            {/* Subtitle */}
                            <label className=" block text-gray-500 mb-2">Subtitle</label>
                            <input
                                type="text"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                                className="w-5/6 mb-4 p-2 border border-gray-300 rounded"
                            />

                            {/* ... Bot Message Section */}
                            <label className="block font-bold mb-2 mt-8">Bot</label>
                            <label className="block text-gray-500 mb-2">Initial Message</label>
                            <input
                                type="text"
                                value={botMessage}
                                onChange={(e) => setBotMessage(e.target.value)}
                                className="w-5/6 mb-4 p-2 border border-gray-300 rounded mr-4"
                            />

                            <label className="block text-gray-500 mb-2">Message Background Color</label>
                            <div className="rounded-2xl flex items-center">
                                {/* Color Input */}
                                <p className="text-xs text-gray-500 mr-4 py-auto">{botMessageBackground}</p>
                                <input
                                    type="color"
                                    value={botMessageBackground}
                                    onChange={(e) => setBotMessageBackground(e.target.value)}
                                />
                            </div>


                            {/* ... Human Message Section*/}
                            <label className="block font-bold mb-2 mt-8">Human</label>
                            <label className="block text-gray-500 mb-2">Initial Message</label>
                            <input
                                type="text"
                                value={humanMessage}
                                onChange={(e) => setHumanMessage(e.target.value)}
                                className="w-5/6 mb-4 p-2 border border-gray-300 rounded mr-4"
                            />

                            <label className="block text-gray-500 mb-2">Message Background Color</label>
                            <div className="rounded-2xl flex items-center">
                                {/* Color Input */}
                                <p className="text-xs text-gray-500 mr-4 py-auto">{humanMessageBackground}</p>
                                <input
                                    type="color"
                                    value={humanMessageBackground}
                                    onChange={(e) => setHumanMessageBackground(e.target.value)}
                                />
                            </div>

                            {/* ... Human Message Section*/}
                            <label className="block font-bold mb-2 mt-8">Composer</label>
                            <label className="block text-gray-500 mb-2">Placeholder Message</label>
                            <input
                                type="text"
                                value={composerPlaceholder}
                                onChange={(e) => setComposerPlaceholder(e.target.value)}
                                className="w-5/6 mb-4 p-2 border border-gray-300 rounded mr-4"
                            />


                        </div>

                        {/* Generate Iframe Code */}
                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={generateIframeCode}
                        >
                            Generate Iframe Code
                        </button>
                    </div>


                    {/* Right Part (Static) */}
                    <div className="relative block h-screen bottom-0 right-0 bg-white w-1/2 p-4 pt-20 ">
                        <div className="w-4/5 h-5/6 bg-white shadow-2xl mx-auto my-auto flex-grow flex flex-col rounded-xl ">
                            <div className="pb-4 rounded-t-xl" style={headerStyle}>
                                <p className="text-white text-xl mt-4 ml-4">{title}</p>
                                <p className="text-white text-md ml-4">{subtitle}</p>
                            </div>
                            <div className="flex justify-start px-2">
                                <div
                                    className={`py-2 px-4 rounded-2xl m-2 text-left text-gray-700`}
                                    style={botMessageStyle}
                                >
                                    {botMessage}
                                </div>
                            </div>
                            <div className="flex justify-end px-2">
                                <div
                                    className={`text-white py-2 px-4 rounded-2xl m-2 text-left`}
                                    style={chatMessageStyle}
                                >
                                    {humanMessage}
                                </div>
                            </div>
                            <div className="bg-white py-4 mt-auto mx-4 justify-self-end">
                                <div className="flex items-center w-full">
                                    <input
                                        type="text"
                                        placeholder={composerPlaceholder}
                                        className="flex-grow border-gray-300 border-t border-b border-l rounded-l-md py-2 px-4 focus:outline-none"
                                    />
                                    <button
                                        className="text-gray-800 font-medium border-t border-b border-r py-2 px-4 rounded-r-md hover:bg-gray-200 focus:outline-none"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ChatbotCustomizer;
