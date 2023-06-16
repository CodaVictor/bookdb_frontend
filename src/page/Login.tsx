import {useState} from "react";
import {useAppDispatch} from "../app/hooks";
import {AppUser, UserAuthenticationResponse, UserLogin} from "../types/AppUser";
import {Backdrop, Box, Button, CircularProgress, Container, Dialog, TextField, Typography} from "@mui/material";
import {setLogin} from "../features/login/loginSlice"


export interface Props {
    isOpen: boolean
    onClose: () => void
}

export function Login({ isOpen, onClose }: Props) {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const dispatch = useAppDispatch();

    const handleLoginSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(null);
        setIsLoading(true);

        const data = new FormData(event.currentTarget);
        const email: string = data.get("email") as string;
        const password: string = data.get("password") as string;
        const userLogin: UserLogin = {username: email, password: password}
        let userToken: string;

        if(email == null || email.length == 0 || password == null || password.length == 0) {
            setErrorMessage("Přihlašovací údaje nemohou být prázdné.");
        } else {
            const loginResponse = await authenticate(userLogin);

            if(loginResponse.error) {
                setErrorMessage(loginResponse.message);
            } else {
                userToken = loginResponse.access_token;
                const appUser = await fetchUserProfile(email, userToken);
                appUser.roles = loginResponse.roles;
                dispatch(setLogin(appUser));
                onClose();
            }
        }

        setIsLoading(false);
    };

    async function fetchUserProfile(email: string, token: string) {
        const queryString = `${backendUrl}/user/info`;

        const result = await fetch(queryString,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/text',
                    'Authorization': `Bearer ${token}`
                },
                body: email
            });
        return (await result.json()) as AppUser
    }

    async function authenticate(login: UserLogin) {
        const queryString = `${backendUrl}/auth/login`;
        const body = JSON.stringify(login);

        const result = await fetch(queryString,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body
            });
        return (await result.json()) as UserAuthenticationResponse
    }

    const handleCloseLogin = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleCloseLogin} open={isOpen}>
            <Backdrop sx={{ color: "#3870b0", bgcolor: "rgba(227,227,227,.5)", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={isLoading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 2,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography component="h1" variant="h5">Přihlášení</Typography>
                    <Box component="form" onSubmit={handleLoginSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Heslo"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        { errorMessage != null && <Typography color="#db6756" sx={{mt: 1}}>{errorMessage}</Typography> }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 3 }}
                        >
                            Sign In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </Dialog>
    )
}