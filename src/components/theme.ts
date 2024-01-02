import { createTheme } from '@mui/material/styles';

export const BACKGROUND_COLOR = '#F1F2F5'; // light grey
export const PRIMARY_COLOR = '#022851'; // dark blue
export const BACKGROUND_COLOR_CONTRAST_TEXT = '#000000'; // black
export const PRIMARY_COLOR_CONTRAST_TEXT = '#FFFFFF'; // white
export const CONTAINER_COLOR = '#FFFFFF'; // white

const H1_SIZE = 32;
const H2_SIZE = 20;
const H3_SIZE = 16;
const FONT_WEIGHT = 600;

// outer theme is for containers - black on white
const theme = createTheme({
  typography: {
    h1: {
      fontSize: H1_SIZE,
      fontWeight: FONT_WEIGHT,
    },
    h2: {
      fontSize: H2_SIZE,
      fontWeight: FONT_WEIGHT,
    },
    h3: {
      fontSize: H3_SIZE,
      fontWeight: FONT_WEIGHT,
    },
  },
  palette: {
    // inner theme is for buttons, textboxes, etc. - white on blue
    primary: {
      main: PRIMARY_COLOR,
      contrastText: PRIMARY_COLOR_CONTRAST_TEXT,
    },
    // outer theme is for containers - black on white
    secondary: {
      main: CONTAINER_COLOR,
      contrastText: BACKGROUND_COLOR_CONTRAST_TEXT,
    },
  },
});

export default theme;
