import {Dimensions, Platform} from 'react-native';
import {getStatusBarHeight} from 'react-native-status-bar-height';

export const IOS = Platform.OS === 'ios';

export const STATUS_BAR_HEIGHT = getStatusBarHeight();

export const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height);
export const SCREEN_WIDTH = Math.round(Dimensions.get('window').width);

export const GOOGLE_GEOCODER_API = 'AIzaSyAfmNOp-Rdw9v6y_1jaoGXwlVDuP3yyXY0';
