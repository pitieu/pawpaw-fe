import 'react-native-gesture-handler';
import React from 'react';

// import {LogBox} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import Toast, {ErrorToast, BaseToast} from 'react-native-toast-message';

import configureStore from './app/store/configureStore.js';
import './app/assets/i18n/i18n';
import Colors from './app/theme/colors';

enableScreens();

// TODO: Remove when fixed
// LogBox.ignoreWarnings([
//   'VirtualizedLists should never be nested',
//   'Warning: componentWillReceiveProps has been renamed, and is not recommended',
//   'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
// ]);

import Navigator from './app/navigation/Navigator';
import RNBootSplash from 'react-native-bootsplash';

const toastConfig = {
  error: props => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: Colors.error,
        borderLeftColor: Colors.error,
      }}
      text1Style={{
        color: Colors.onError,
      }}
      text1NumberOfLines={3}
      text2NumberOfLines={3}
      text2Style={{
        color: Colors.onError,
      }}
    />
  ),
  default: props => (
    <BaseToast
      {...props}
      style={{borderLeftWidth: 0}}
      contentContainerStyle={{
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor: Colors.onBackground,
        borderRadius: 5,
      }}
      text1Style={{
        padding: 0,
        margin: 0,
        color: Colors.white,
        fontSize: 12,
        fontWeight: '400',
      }}
    />
  ),
};

// APP
const App = () => {
  React.useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide();
    }, 1000);
  });
  return (
    <Provider store={configureStore}>
      <MenuProvider>
        <SafeAreaProvider>
          <Navigator />
          <Toast config={toastConfig} />
        </SafeAreaProvider>
      </MenuProvider>
    </Provider>
  );
};

export default App;
