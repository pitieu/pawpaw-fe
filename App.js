import 'react-native-gesture-handler';
import React from 'react';

// import {LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import './app/assets/i18n/i18n';
import Toast, {ErrorToast} from 'react-native-toast-message';

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
};

// APP
const App = () => {
  React.useEffect(() => {
    setTimeout(() => {
      RNBootSplash.hide();
    }, 1000);
  });
  return (
    <SafeAreaProvider>
      <Navigator />
      <Toast config={toastConfig} />
    </SafeAreaProvider>
  );
};

export default App;
