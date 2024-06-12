import { createTheme, Theme } from '@material-ui/core/styles';
import { orange, blue } from '@material-ui/core/colors';

declare module '@material-ui/core/styles/createTheme' {
  interface Theme {
    custom: {
    };
  }
  interface ThemeOptions {
    custom?: {
    };
  }
}



const theme: Theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', 
      light: '#A5D6A7', 
    },
    secondary: {
      main: '#FF9800',
      light: '#FFCC80',  
    },
  },
});

export default theme;
