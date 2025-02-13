// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#808080', // Changed from '#1a1a1a' to '#808080'
        },
        secondary: {
            main: '#ffae00', // Use secondary for orange accents
        },
        background: {
            default: '#1a1a1a',
            paper: '#333333',
        },
        text: {
            primary: '#ffffff',
            secondary: '#cfd8dc',
        },
    },
    typography: {
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
    },
});

export default theme;
