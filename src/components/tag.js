import React from 'react';
import Chip from '@mui/material/Chip';

export default function Tag({ text }) {
    console.log(text)
    return (
        <Chip
            variant="outlined"
            label={text}
            sx={{ backgroundColor: '#F2F4F7', color: '#091E42', borderColor: '#F2F4F7' }}
            className="ml-2"
        />
    );
}
