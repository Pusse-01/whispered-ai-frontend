import React from 'react';
import {
    useNavigate
} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterIcon from '@mui/icons-material/Filter';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';

function BotsHeader() {
    const navigate = useNavigate();

    const handleAddFile = () => {
        // Navigate to the file uploading component
        navigate('/create-bot');
    };

    return (
        <div>
            {/* Container */}
            <div
                className="flex justify-between items-center mb-4"
            >
                <div className="text-2xl font-bold">Select your bot</div>
                <Button
                    variant="contained"
                    startIcon={<ControlPointOutlinedIcon />}
                    style={{ backgroundColor: '#1250B9' }}
                    className="text-white ml-4 rounded-xl"
                    onClick={handleAddFile}
                >
                    Create New Bot
                </Button>
            </div>

            {/* Row */}


        </div>
    );
}

export default BotsHeader;
