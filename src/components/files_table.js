import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Tag from './tag';
import { getUserDataFromLocalStorage } from '../utils';
import API_BASE_URL from '../config';

const columns = [
    { id: 'file_name', label: 'Name', minWidth: 170 },
    { id: 'updated_time', label: 'Details', minWidth: 170 },
    { id: 'folder', label: 'Folder', minWidth: 200 },
    { id: 'delete', label: '', minWidth: 20 },
];

function FilesTable() {
    const user = getUserDataFromLocalStorage();
    const [rows, setRows] = useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedFileForDeletion, setSelectedFileForDeletion] = useState(null);
    const [isDeleteSuccess, setDeleteSuccess] = useState(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const { folder_id } = useParams();

    useEffect(() => {
        setIsLoading(true);
        fetch(`${API_BASE_URL}/files/${folder_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setRows(data.files);
                console.log(data)
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, [folder_id]);

    const handleDeleteFile = () => {
        setIsLoadingDelete(true);
        // Implement your delete file logic here, using the /delete-file endpoint
        fetch(`${API_BASE_URL}/delete-file`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                folder_id: folder_id,
                file_name: selectedFileForDeletion,
            }),
        })
            .then((response) => {
                if (response.ok) {
                    setDeleteSuccess(true);
                } else {
                    setDeleteSuccess(false);
                }
            })
            .catch((error) => {
                console.error('Error deleting file:', error);
                setDeleteSuccess(false);
            })
            .finally(() => {
                setIsLoadingDelete(false);
                setDialogOpen(false);
            });
    };

    const openDeleteDialog = (file) => {
        setSelectedFileForDeletion(file);
        setDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setDialogOpen(false);
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
        <>
            {isLoading ? (
                <CircularProgress />
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <TableContainer sx={{ maxHeight: 440 }} className='rounded-xl'>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            align={column.align}
                                            style={{ minWidth: column.minWidth }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {column.id === 'folder' ? (
                                                                row.tags.map((tag) => (
                                                                    <Tag key={tag} text={tag} />
                                                                ))
                                                            ) : column.id === 'updated_time' ? (
                                                                formatDate(value)
                                                            ) : column.id === 'delete' ? (
                                                                <IconButton
                                                                    onClick={() => openDeleteDialog(row.file_name)}
                                                                    color="primary"
                                                                >
                                                                    <DeleteOutlineIcon />
                                                                </IconButton>
                                                            ) : (
                                                                value
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(event, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(event) => {
                            setRowsPerPage(+event.target.value);
                            setPage(0);
                        }}
                    />
                </Paper>
            )}
            <Dialog open={isDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    {selectedFileForDeletion && (
                        <p>Are you sure you want to delete the file: {selectedFileForDeletion}?</p>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteFile}
                        color="primary"
                    >
                        {isLoadingDelete ? (
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
                    {isDeleteSuccess ? 'File deleted successfully.' : 'Error deleting file.'}
                </MuiAlert>
            </Snackbar>
        </>
    );
}

export default FilesTable;
