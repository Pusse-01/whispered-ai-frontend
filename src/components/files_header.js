import React, { useState } from 'react';
import {
    useNavigate, useParams
} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/Filter';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import FileUploader from './file_uploader';
import { TextField, Typography, Dialog, Button, DialogContent, DialogTitle, DialogActions } from '@mui/material';


function FilesHeader() {
    const folder_id = useParams();
    const navigate = useNavigate();
    const [fileUploadDialog, setFileUploadDialogOpen] = useState(false)

    const handleAddFile = () => {
        // Navigate to the file uploading component
        setFileUploadDialogOpen(true)
    };

    return (
        <div>
            <Dialog open={fileUploadDialog} onClose={() => setFileUploadDialogOpen(false)}>
                <DialogTitle>Add new file</DialogTitle>
                <DialogContent>
                    <FileUploader folder_id={folder_id} />
                </DialogContent>
                {/* <DialogActions>
                    <Button onClick={() => setFormOpen(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions> */}
            </Dialog>
            {/* Container */}
            <div
                className="flex justify-between items-center mb-4"
            >
                <div className="text-2xl font-bold">File Library</div>
                <Button
                    variant="contained"
                    startIcon={<ControlPointOutlinedIcon />}
                    style={{ backgroundColor: '#1250B9' }}
                    className="text-white ml-4 rounded-xl"
                    onClick={handleAddFile}
                >
                    Add File
                </Button>
            </div>

            {/* Row */}
            <div

                className="flex justify-center mb-4">
                <TextField
                    variant="outlined"
                    placeholder="Search file"
                    InputProps={{ startAdornment: <SearchIcon /> }}
                    className="pr-4 md:pr-8 w-full"
                />
                {/* <Button
                    // onClick={handleSearch}
                    // style={{ backgroundColor: '#0C0F35' }}
                    // variant="outlined"
                    startIcon={<FilterIcon />}
                    className=" px-4 py-2 rounded-r "
                >
                    Filter
                </Button> */}
            </div>

        </div>
    );
}

export default FilesHeader;
