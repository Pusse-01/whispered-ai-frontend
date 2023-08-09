import React from 'react'
import FilesHeader from '../components/files_header'
import FilesTable from '../components/files_table'

function FileLibrary() {
    return (

        <div className=" px-4 md:px-8 py-4 ml-20">
            <FilesHeader />
            <FilesTable />

        </div>
    )
}

export default FileLibrary
