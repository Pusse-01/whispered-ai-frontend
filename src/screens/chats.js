import React from 'react'
import Chats from '../components/chats_component'

function ChatsPage({ selectedItem, setSelectedItem }) {
    return (
        <div className='w-5/6 mx-auto'>
            <Chats selectedItem={selectedItem} setSelectedItem={setSelectedItem} />
        </div>
    )
}

export default ChatsPage
