import React, { useState, useEffect } from 'react'
import FolderCard from './folder_card';
import { getUserDataFromLocalStorage } from '../utils'
import API_BASE_URL from '../config';

function FolderList() {
    const [folders, setFolders] = useState([]);
    const user = getUserDataFromLocalStorage();

    useEffect(() => {
        console.log(user)
        // Fetch folders data using the /folders/{user_id} endpoint
        const fetchFolders = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/folders/${user._id}`);
                const data = await response.json();
                console.log(data)
                setFolders(data.folders);
            } catch (error) {
                console.error('Error fetching folders:', error);
            }
        };

        fetchFolders();
    }, [user._id]);

    return (
        <div className="flex flex-wrap">
            {folders.map(folder => (
                <FolderCard key={folder.id} folder={folder} />
            ))}
        </div>
    );
};
export default FolderList
