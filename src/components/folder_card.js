import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import MuiAlert from '@mui/material/Alert';
import { API_BASE_URL } from '../config';

const FolderCard = ({ folder }) => {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [isDeleteSuccess, setDeleteSuccess] = useState(null);

    const handleDeleteFolder = () => {
        setLoading(true);
        // Replace this with your actual delete folder API call
        fetch(`${API_BASE_URL}/delete-folder/${folder.id}`, {
            method: 'DELETE',
        })
            .then((response) => {
                if (response.ok) {
                    setDeleteSuccess(true);
                    window.location.reload()
                } else {
                    setDeleteSuccess(false);
                }
            })
            .catch((error) => {
                console.error('Error deleting folder:', error);
                setDeleteSuccess(false);
            })
            .finally(() => {
                setLoading(false);
                setDialogOpen(false); // Close the dialog
                window.location.reload()
            });
    };

    const openDeleteDialog = () => {
        setDialogOpen(true);
    };
    const closeDeleteDialog = () => {
        setDialogOpen(false);
    };

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
        <div>

            <Card style={cardStyle} className="hover:bg-gray-100 text-left">
                <CardContent>
                    <div className='flex justify-between'>

                        <Link to={`/files/${folder.id}`}>
                            <Typography variant="h6">{folder.name}</Typography></Link>
                        <IconButton
                            //  color="secondary"
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent the link from being triggered
                                openDeleteDialog(); // Open the delete dialog
                            }}
                        >
                            <DeleteIcon />
                        </IconButton></div>

                    <Typography variant="body2" color="textSecondary">
                        Created at: {formatDate(folder.created_time)}
                    </Typography>
                </CardContent>
            </Card>

            <Dialog open={isDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this folder?
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteFolder} style={{ color: 'red' }}>
                        {isLoading ? (
                            <CircularProgress size={24} />
                        ) : (
                            'Delete'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={isDeleteSuccess !== null}
                autoHideDuration={6000}
                onClose={() => setDeleteSuccess(null)}
            >
                <MuiAlert
                    elevation={6}
                    variant="filled"
                    severity={isDeleteSuccess ? 'success' : 'error'}
                    onClose={() => setDeleteSuccess(null)}
                >
                    {isDeleteSuccess
                        ? 'Folder deleted successfully.'
                        : 'Error deleting folder.'}
                </MuiAlert>
            </Snackbar>
        </div>
    );

};

export default FolderCard;
