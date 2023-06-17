import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ConfirmationDialogProps {
    title: string
    message: string
    yesButtonText: string
    noButtonText: string
    onYesClicked?: () => void
    onNoClicked?: () => void
    onClose?: () => void
}

export function ConfirmationDialog(props: ConfirmationDialogProps) {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
        props.onClose && props.onClose();
    };

    return (
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.onYesClicked}>{props.yesButtonText}</Button>
                    <Button onClick={props.onNoClicked}>{props.noButtonText}</Button>
                </DialogActions>
            </Dialog>
    );
}
