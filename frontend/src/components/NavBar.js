import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { getNotifications } from "../api/api";



export default function NavBar({ user, onLogout }) {
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);

    const currentUserId = localStorage.getItem("currentUserId");

    const loadNotifications = async () => {
        if (!currentUserId) return;

        try {
            const data = await getNotifications(currentUserId);
            setNotifications(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(loadNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const totalCount =
        notifications.reduce((sum, n) => sum + n.count, 0);

    const handleOpenMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleNotificationClick = (notif) => {
        navigate(`/chat/${notif.senderId}`, {
            state: { otherUserName: notif.fullName }
        });

        handleCloseMenu();
        loadNotifications();
    };

    const handleLogout = () => {
        onLogout();
        navigate("/login");
    };
    return (
        <AppBar position="static">
            <Toolbar className="navbar-toolbar">
                <Typography variant="h6" className="navbar-title">
                    Medical App
                </Typography>
                <Box className="navbar-links">
                    {user?.loggedIn && user.role === "doctor" && (
                        <Button color="inherit" component={Link} to="/dashboard">
                            Dashboard
                        </Button>
                    )}
                    {user?.loggedIn && user.role === "doctor" && (
                        <Button color="inherit" component={Link} to="/prescribe">
                            Prescriptions
                        </Button>
                    )}

                    {user?.loggedIn && (
                        <Button color="inherit" component={Link} to="/treatments">
                            Treatments
                        </Button>
                    )}

                    {user?.loggedIn && user.role === "doctor" && (
                        <Button color="inherit" component={Link} to="/export">
                            Export
                        </Button>
                    )}


                </Box>
                <Box className="navbar-auth">

                    {user?.loggedIn && (
                        <>
                            <IconButton color="inherit" onClick={handleOpenMenu}>
                                <Badge badgeContent={totalCount} color="error">
                                    <NotificationsIcon />
                                </Badge>
                            </IconButton>

                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleCloseMenu}
                            >
                                {notifications.length === 0 && (
                                    <MenuItem disabled>
                                        No notifications
                                    </MenuItem>
                                )}

                                {notifications.map((n) => (
                                    <MenuItem
                                        key={n.senderId}
                                        onClick={() => handleNotificationClick(n)}
                                    >
                                        <div>
                                            <strong>{n.fullName}</strong>
                                            <br />
                                            <small>
                                                {n.message} ({n.count})
                                            </small>
                                        </div>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </>
                    )}

                    {!user?.loggedIn ? (
                        <Button color="inherit" component={Link} to="/login">
                            Login
                        </Button>
                    ) : (
                        <Button color="inherit" onClick={handleLogout}>
                            Logout
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}