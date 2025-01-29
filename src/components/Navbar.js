// src/components/Navbar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

// Styled Components for Enhanced Styling
const StyledAppBar = styled(AppBar)`
  background-color: #4a4a4a !important; /* Gray color */
  box-shadow: none;
  padding: 0 5%;
  position: fixed;
  top: 0;
  z-index: 1000;
  height: 80px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #4a4a4a !important;
  }

  @media (max-width: 960px) {
    padding: 0 2%;
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #ffffff;
  font-weight: bold;
  font-size: 1.2rem;
  flex-grow: 1;

  img {
    width: 130px;
    height: 90px;
    margin-right: 10px;
    object-fit: contain;
  }

  @media (max-width: 600px) {
    font-size: 1.5rem;

    img {
      width: 40px;
      height: 40px;
      margin-right: 8px;
    }
  }
`;

const NavLinks = styled(Box)`
  display: flex;
  align-items: center;

  a {
    color: #ffffff;
    text-decoration: none;
    margin-left: 25px;
    font-size: 1rem;
    font-weight: 500;
    transition: color 0.3s ease, transform 0.3s ease;

    &:hover {
      color: #ffae00; /* Use secondary color for accents */
      transform: translateY(-3px);
    }

    @media (max-width: 960px) {
      margin-left: 20px;
      font-size: 0.9rem;
    }
  }
`;

const StyledButton = styled(Button)`
  color: #ffffff;
  margin-left: 25px;
  font-size: 1rem;
  font-weight: 500;
  text-transform: none;
  border: 1px solid #ffae00;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #ffae00;
    color: #1a1a1a;
    transform: scale(1.05);
  }

  @media (max-width: 960px) {
    margin-left: 20px;
    font-size: 0.9rem;
  }
`;

// Mobile Menu Button Styling
const MobileMenuButton = styled(IconButton)`
  color: #ffffff;
`;

// Mobile Menu Styling
const MobileMenu = styled(Menu)`
  & .MuiPaper-root {
    background-color: #1a1a1a;
    color: #ffffff;
    width: 250px;
    border-radius: 8px;
  }

  & .MuiMenuItem-root {
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.3s ease;

    &:hover {
      background-color: #ffae00;
      color: #1a1a1a;
      transform: scale(1.02);
    }
  }
`;

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handle Opening of Mobile Menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle Closing of Mobile Menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar disableGutters>
        {/* Logo */}
        <Logo to="/">
          <img src="/assets/logos/LogoW.png" alt="Logo" />
        </Logo>

        {/* Desktop Navigation Links */}
        {!isMobile && (
          <NavLinks>
            <Link to="/">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/learn-more">Learn More</Link>
            <Link to="/contact">Contact Us</Link>
            <StyledButton component={Link} to="/testing-login">
              Login
            </StyledButton>
          </NavLinks>
        )}

        {/* Mobile Navigation Menu */}
        {isMobile && (
          <Box>
            <MobileMenuButton
              size="large"
              edge="end"
              aria-label="menu"
              onClick={handleMenuOpen}
            >
              {anchorEl ? <CloseIcon /> : <MenuIcon />}
            </MobileMenuButton>
            <MobileMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                Home
              </MenuItem>
              <MenuItem component={Link} to="/about" onClick={handleMenuClose}>
                About Us
              </MenuItem>
              <MenuItem
                component={Link}
                to="/learn-more"
                onClick={handleMenuClose}
              >
                Learn More
              </MenuItem>
              <MenuItem
                component={Link}
                to="/contact"
                onClick={handleMenuClose}
              >
                Contact Us
              </MenuItem>
              <MenuItem
                component={Link}
                to="/testing-login"
                onClick={handleMenuClose}
              >
                Login
              </MenuItem>
            </MobileMenu>
          </Box>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
