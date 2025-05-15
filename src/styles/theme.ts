import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0033a3',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f59a00',
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
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f5bb09',
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#f5bb09',
          },
        },
      },
    },
    MuiDialog: {
        styleOverrides: {
            paper: {
                backgroundImage: 'none',
            },
        },
    },
  },
});

export default theme;
