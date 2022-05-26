import 'react-native-gesture-handler';
import React from 'react';
// import {LogBox} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {enableScreens} from 'react-native-screens';
import './app/assets/i18n/i18n';

enableScreens();

// TODO: Remove when fixed
// LogBox.ignoreWarnings([
//   'VirtualizedLists should never be nested',
//   'Warning: componentWillReceiveProps has been renamed, and is not recommended',
//   'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
// ]);

// import MainNavigatorA or MainNavigatorB to preview design differences
import Navigator from './app/navigation/Navigator';
import RNBootSplash from 'react-native-bootsplash';

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
    </SafeAreaProvider>
  );
};

export default App;
