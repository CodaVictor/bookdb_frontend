import {Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, ListItemButton, ListItemText} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import {UserLogin} from "../types/AppUser";

interface Props {
    open: boolean;
    onLogin: (login: UserLogin) => void;
    onClose: (value: string) => void;
}

export function LoginDialog({open, onLogin, onClose}: Props) {

    const handleClose = () => {
        onClose("");
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Login</DialogTitle>

        </Dialog>
    );
}