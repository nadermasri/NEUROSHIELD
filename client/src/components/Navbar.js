import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

const StyledAppBar = styled(AppBar)`
  background-color: #1a1a1a !important;
`;

const NavLinks = styled.div`
  flex-grow: 1;
  a {
    margin: 0 1rem;
    color: #ffffff;
    font-weight: 500;
    &:hover { color: #00bcd4; }
  }
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.img`
  height: 40px;
  margin-right: 0.5rem;
`;

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <StyledAppBar position="static">
      <Toolbar>
        <Brand>
          <Logo src="/assets/logos/LogoL.png" alt="NeuroShield Logo" />
          <Typography variant="h6" component={Link} to="/" style={{ color: '#ffffff', textDecoration: 'none' }}>
            NeuroShield
          </Typography>
        </Brand>
        <NavLinks>
          <Link to="/">Home</Link>
          <Link to="/about">About Us</Link>
          <Link to="/learn-more">Learn More</Link>
          <Link to="/contact">Contact Us</Link>
        </NavLinks>
        {token ? (
          <>
            {role === 'tester' && (
              <>
                <Button component={Link} to="/dashboard" variant="contained" style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginRight: '1rem' }}>
                  Dashboard
                </Button>
                <Button component={Link} to="/profile" variant="contained" style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginRight: '1rem' }}>
                  Profile
                </Button>
              </>
            )}
            {role === 'admin' && (
              <Button component={Link} to="/admin-dashboard" variant="contained" style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginRight: '1rem' }}>
                Admin Dashboard
              </Button>
            )}
            <Button onClick={handleLogout} variant="contained" style={{ backgroundColor: '#00bcd4', color: '#ffffff' }}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button component={Link} to="/signup" variant="contained" style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginRight: '1rem' }}>
              Signup
            </Button>
            <Button component={Link} to="/tester-login" variant="contained" style={{ backgroundColor: '#00bcd4', color: '#ffffff', marginRight: '1rem' }}>
              Tester Login
            </Button>
            <Button component={Link} to="/admin-login" variant="contained" style={{ backgroundColor: '#00bcd4', color: '#ffffff' }}>
              Admin Login
            </Button>
          </>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

export default Navbar;
