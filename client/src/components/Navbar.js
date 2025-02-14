// client/src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const StyledAppBar = styled(AppBar)`
  background: linear-gradient(90deg, #1a1a1a, #333333);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

const Logo = styled.img`
  height: 50px;
  margin-right: 0.5rem;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  a {
    margin: 0 1rem;
    color: #ffffff;
    font-weight: 500;
    text-decoration: none;
    transition: color 0.3s ease;
    &:hover {
      color: #00bcd4;
    }
  }
  @media (max-width: 768px) {
    display: none;
  }
`;

// Updated AccountButtons with gap property for spacing between buttons
const AccountButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem; /* Adds spacing between buttons */
  @media (max-width: 768px) {
    display: none;
  }
`;

// MobileMenuButton styled component remains the same.
const MobileMenuButton = styled(IconButton)`
  color: #ffffff;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  // useMediaQuery to check if the screen is mobile size (<= 768px)
  const isMobile = useMediaQuery('(max-width:768px)');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Define common navigation items
  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Learn More', to: '/learn-more' },
    { label: 'Contact Us', to: '/contact' },
  ];

  // Define account items based on authentication status
  const accountItems = token
    ? role === 'tester'
      ? [
          { label: 'Dashboard', to: '/dashboard' },
          { label: 'Profile', to: '/profile' },
          { label: 'Logout', action: handleLogout },
        ]
      : role === 'admin'
      ? [
          { label: 'Admin Dashboard', to: '/admin-dashboard' },
          { label: 'Logout', action: handleLogout },
        ]
      : []
    : [
        { label: 'Signup', to: '/signup' },
        { label: 'Tester Login', to: '/tester-login' },
        { label: 'Admin Login', to: '/admin-login' },
      ];

  // Combine items for mobile drawer
  const drawerItems = [...navItems, ...accountItems];

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <Brand>
            <Logo src="/assets/logos/LogoL.png" alt="NeuroShield Logo" />
            <Typography
              variant="h6"
              component={Link}
              to="/"
              style={{ color: '#ffffff', textDecoration: 'none' }}
            >
              NeuroShield
            </Typography>
          </Brand>
          <NavLinks>
            {navItems.map((item, idx) => (
              <Link key={idx} to={item.to}>
                {item.label}
              </Link>
            ))}
          </NavLinks>
          <AccountButtons>
            {accountItems.map((item, idx) =>
              item.to ? (
                <Button
                  key={idx}
                  component={Link}
                  to={item.to}
                  variant="contained"
                  style={{ backgroundColor: '#00bcd4', color: '#ffffff' }}
                >
                  {item.label}
                </Button>
              ) : (
                <Button
                  key={idx}
                  onClick={item.action}
                  variant="contained"
                  style={{ backgroundColor: '#00bcd4', color: '#ffffff' }}
                >
                  {item.label}
                </Button>
              )
            )}
          </AccountButtons>
          {/* Render Mobile Menu Button only on mobile screens */}
          {isMobile && (
            <MobileMenuButton edge="end" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </MobileMenuButton>
          )}
        </Toolbar>
      </StyledAppBar>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250, backgroundColor: '#1a1a1a', height: '100%', color: '#ffffff' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {drawerItems.map((item, idx) =>
              item.to ? (
                <ListItem button key={idx} component={Link} to={item.to}>
                  <ListItemText primary={item.label} />
                </ListItem>
              ) : (
                <ListItem button key={idx} onClick={item.action}>
                  <ListItemText primary={item.label} />
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
