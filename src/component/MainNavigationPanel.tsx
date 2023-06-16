import * as React from 'react';
import {AppBar, Box, Toolbar, IconButton, Typography, Menu, Container, Avatar, Button, MenuItem, Link} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import {Link as RouterLink} from "react-router-dom";
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';
import {useSelector} from "react-redux";
import {RootState} from "../app/store";
import {Login} from "../page/Login";
import {useAppDispatch} from "../app/hooks";
import {setLogout} from "../features/login/loginSlice";

interface PageNameUrl {
    name: string
    url: string
    allowFor: string[]
}

const pages: PageNameUrl[] = [
        { name: "Knihy", url: "/", allowFor: [] },
        { name: "Autoři", url: "/authors", allowFor: [] },
        { name: "Správa knih", url: "/manage/books", allowFor: ["ROLE_ADMIN", "ROLE_EDITOR"] }
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

        if (userOption === "Login") {
            setCanShowLogin(true);
        } else if (userOption === "Logout") {
            dispatch(setLogout());
        }
    };

    const handleCloseLogin = () => {
        setCanShowLogin(false);
    };

    const getPageButtons = () => {
        return pages.filter((page) => {
            if (page.allowFor == null || page.allowFor.length === 0) {
                return true
            } else {
                if (isUserLoggedIn && appUser.value?.roles != null && appUser.value?.roles.length > 0) {
                    return appUser.value?.roles.some(v => page.allowFor.includes(v));
                } else {
                    return false
                }
            }
        });
    }

    return <>
        <AppBar position="static" sx={{background: '#d1c7c7'}}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <MenuBookRoundedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BookDB
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
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
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            { getPageButtons().map((page) => {
                                return (
                                    <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                        <Link component={RouterLink} to={page.url} underline="none">
                                            {page.name}
                                        </Link>
                                    </MenuItem>)
                            }) }
                        </Menu>
                    </Box>
                    <MenuBookRoundedIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    {<Typography
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
                        BookDB
                    </Typography>}
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        {getPageButtons().map((page) => (
                            <Button component={RouterLink} to={page.url}
                                    key={page.name}
                                    onClick={handleCloseNavMenu}
                                    sx={{my: 2, color: 'white', display: 'block'}}>
                                {page.name}
                            </Button>
                        ))}
                    </Box>

                    <Box sx={{flexGrow: 0, display: "flex", alignItems: "center"}}>
                        {isUserLoggedIn &&
                            <Typography sx={{mr: 1}}>
                                {appUser.value?.firstName + " " + appUser.value?.lastName +
                                    " (" + appUser.value?.roles.map((item) => item.replace("ROLE_", "")).join(", ") + ")"}
                            </Typography>}

                        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                            <Avatar alt="User User" src="https://cdn-icons-png.flaticon.com/512/6596/6596121.png"/>
                        </IconButton>
                        <Menu
                            sx={{mt: '45px'}}
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
                            {isUserLoggedIn ?
                                <MenuItem key={"Logout"} onClick={() => handleSelectMenuItem("Logout")}>
                                    <Typography textAlign="center">Logout</Typography>
                                </MenuItem> :
                                <MenuItem key={"Login"} onClick={() => handleSelectMenuItem("Login")}>
                                    <Typography textAlign="center">Login</Typography>
                                </MenuItem>}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>

        {canShowLogin && <Login isOpen={canShowLogin} onClose={handleCloseLogin}/>}
    </>
}