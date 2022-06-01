// import config setting
import config from '../config';

// Color Themes
const themes = {
  main: {
    // primary color
    primaryLightColor: '#1D3A708c',
    primaryColor: '#1D3A70', //00b970//bc0021
    primaryColorDark: '#00945a',
    primaryColorLight: '#00e78c',
    onPrimaryColor: '#ffffff', //
    customOnPrimaryColor: '#1D3A70',

    //dark background
    //darkBackgroundColor:'#1D3A70',
    //darkScreenPrimaryText:'#ffffff',
    //darkScreenSecondaryText:'#ffffff',

    // accent color, triad
    accentColor: '#0069b9',
    onAccentColor: '#fff',

    // secondary color, primary color split
    secondaryColor: '#b90039',
    onSecondaryColor: '#fff',

    // tertiary color, secondary color intermediately related
    tertiaryColor: '#0740AC',
    onTertiaryColor: '#fff',

    // status bar color
    statusBarColor: '#1D3A70', //#fff

    // gradient colors
    primaryGradientColor: '#1D3A70',
    secondaryGradientColor: '#1D3A70',

    // overlay color
    overlayColor: '#b90039',

    // text color
    primaryText: '#010203', //#010203
    secondaryText: '#5d5d5d',
    disabledText: 'rgba(0, 0, 0, 0.38)',

    // background, surface
    background: '#ffffff',
    onBackground: '#212121',
    surface: '#fff',
    onSurface: '#757575',
    error: '#cd040b',
    onError: '#fff',
    black: '#010203',
    white: '#fff',
    lightGray: '#eee',
    gray: '#aaa',

    // focus color
    focusColor: '#E02954',
    onFocusColor: '#fff',
  },
};

const theme = themes[config.theme];

export default theme;
