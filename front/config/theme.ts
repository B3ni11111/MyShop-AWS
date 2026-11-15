import { createTheme } from "@mui/material";

const theme = createTheme({
  shape: {
    // 8px base: 1 = 8px (images, inputs, buttons), 2 = 16px (cards, panels, modals)
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
  },
  palette: {
    primary: {
      main: "#2d3e50",
    },
    secondary: {
      main: "#415a77",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
    text: {
      primary: "#1b263b",
      secondary: "#5c6b7a",
    },
  },
});

export default theme;
