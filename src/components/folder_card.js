import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const FolderCard = ({ folder }) => {
    const cardStyle = {
        minWidth: '275px',
        margin: '1rem',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease-in-out',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
        },
    };

    function formatDate(dateString) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    }

    return (
        <Link to={`/files/${folder.id}`}>
            <Card style={cardStyle} className="hover:bg-gray-100">
                <CardContent>
                    <Typography variant="h6">{folder.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Created at: {formatDate(folder.created_time)}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default FolderCard;
