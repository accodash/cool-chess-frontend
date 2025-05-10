import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#673ab7',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ffc107',
    },
    error: {
      main: '#d32f2f',
    },
    background: {
      default: '#101010',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#f0f0f0',
      secondary: '#aaaaaa',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          color: 'white',
          '&.MuiButton-outlined': {
            borderColor: '#555',
          }
        },
      },
    },
  },
});

export default theme;
