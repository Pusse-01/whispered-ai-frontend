import React from 'react'
import { getUserDataFromLocalStorage } from '../utils'
import BotSharingPage from './bot-share';

function Home() {
    const user = getUserDataFromLocalStorage();

    const iframeStyle = {
        border: '0px',
        height: '800px',
        width: '100%',
    };

    return (
        <div className="">
        </div>
    )
}

export default Home
