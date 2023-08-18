import React from 'react'

import FolderList from '../components/folders_list'
import FolderHeader from '../components/folder_header'

function Folders() {
    return (

        <div className=" px-4 md:px-8 py-4 ml-20">
            <FolderHeader />
            <FolderList />

        </div>
    )
}

export default Folders