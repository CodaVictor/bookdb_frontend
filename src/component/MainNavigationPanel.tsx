import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../app/store";
import {Login} from "../page/Login";
import {useAppDispatch} from "../app/hooks";
import {setLogout} from "../features/login/loginSlice";

interface PageNameUrl {
    name: string
    url: string
}

const pages: PageNameUrl[] = [
        { name: "Knihy", url: "/" },
        { name: "Autoři", url: "/authors" }
];

export function MainNavigationPanel() {
    const dispatch = useAppDispatch();
    const appUser = useSelector((state: RootState) => state.login);
    const isUserLoggedIn = appUser.value != undefined || appUser.value != null;

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [canShowLogin, setCanShowLogin] = React.useState(false);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleSelectMenuItem = (userOption: string) => {
        setAnchorElUser(null);

        if(userOption === "Login") {
            setCanShowLogin(true);
        } else if(userOption === "Logout") {
            dispatch(setLogout());
        }
    };

    const handleCloseLogin = () => {
        setCanShowLogin(false);
    };

    return <>
        <AppBar position="static" sx={{background: '#d1c7c7'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BookDB
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">{page.name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button component={Link} to={page.url}
                                key={page.name}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{ flexGrow: 0, display: "flex", alignItems: "center" }}>
                        { isUserLoggedIn &&
                            <Typography sx={{mr: 1}}>
                                {appUser.value?.firstName + " " + appUser.value?.lastName + " (" + appUser.value?.roles.join(", ") + ")"}
                            </Typography>}

                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                            <Avatar alt="User User" src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png" />
                        </IconButton>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleSelectMenuItem}
                        >
                            { isUserLoggedIn ?
                                <MenuItem key={"Logout"} onClick={() => handleSelectMenuItem("Logout")}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem> :
                                <MenuItem key={"Login"} onClick={() => handleSelectMenuItem("Login")}>
                                    <Typography textAlign="center">Login</Typography>
                                </MenuItem> }
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>

        { canShowLogin && <Login isOpen={canShowLogin} onClose={handleCloseLogin}/> }
    </>
}