import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 600,
    },
  },
  palette: {
    background: {
      default: '#F1F2F5',
    },
    primary: {
      main: '#022851',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#000000',
    },
  },
});

export default theme;
