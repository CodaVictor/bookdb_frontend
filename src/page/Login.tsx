import {useState} from "react";
import {LoginDialog} from "../component/LoginDialog";
import {useAppDispatch} from "../app/hooks";
import {AppUser, UserLogin, UserTokens} from "../types/AppUser";
import {useQuery} from "react-query";

export function Login() {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [open, setOpen] = useState(true)
    const [userLogin, setUserLogin] = useState<UserLogin>();
    const dispatch = useAppDispatch();

    async function fetchUserProfile(email: string) {
        const queryString = `${backendUrl}/user/info`;
        const result = await fetch(queryString,
            {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain' },
                body: email
            });
        return (await result.json()) as AppUser
    }

    async function authenticate(login: UserLogin | undefined) {
        const queryString = `${backendUrl}/login`;
        const result = await fetch(queryString,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(login)
            });
        return (await result.json()) as UserTokens
    }

    const userProfileQuery = useQuery({
        queryKey: ["user-profile"],
        queryFn: () => fetchUserProfile("publishers"),
    });

    const loginQuery = useQuery({
        queryKey: ["user-login", userLogin],
        enabled: !!userLogin,
        queryFn: () => authenticate(userLogin)
    });

    const handleLogin = (login: UserLogin) => {
        setUserLogin(login);
    }

    const handleClose = (value: string) => {
        setOpen(false);
    };

    /*
    TODO: Check is authorization is success and fetch user profile
    */

    return (
        <LoginDialog
            open={open}
            onClose={handleClose}
            onLogin={handleLogin}
        />
    )
}