import { createMuiTheme } from '@material-ui/core/styles';

const bgColor = '#436D9B';
const textColor = '#B6DEFA';
const activeColor = '#15A5FA';
const activeBgColor = '#2B4059';
const activeBgColorRgba = 'rgba(42, 64, 89, 0.5)';

const theme = createMuiTheme({
  overrides: {
    MuiFilledInput: {
      root: {
        borderRadius: '0 !important',
        backgroundColor: '#fff',
        '&:hover': {
          backgroundColor: '#fff',
        },
        '&$focused': {
          backgroundColor: '#fff'
        }
      },
    },
    MuiButton: {
      containedPrimary: {
        'a&:hover': {
          color: '#fff',
        },
      },
      root: {
        '& svg': {
          marginRight: 4,
        },
        '& + &': {
          marginLeft: 8,
        },
        'a&:hover': {
          color: 'inherit',
        },
      },
    },
  },
  palette: {
    primary: {
      light: '#6cd6ff',
      main: '#15a5fa',
      dark: '#0077c7',
      contrastText: '#fff',
    },
  },
  custom: {
    // Basic theme color based on out brand color
    // https://material.io/tools/color/#!/?view.left=0&view.right=1&primary.color=13c39d
    dark: {
      bgColor,
      textColor,
      activeColor,
      activeBgColor,
      activeBgColorRgba,
    }
  },
});

export default theme;
