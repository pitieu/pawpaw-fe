// import dependencies
import React, {useState, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Platform,
  I18nManager,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Subtitle1,
  Subtitle2,
  Subtitle3,
} from '../../../components/text/CustomText';

// import components
import UnderlineTextInput from '../../../components/textinputs/UnderlineTextInput';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const IOS = Platform.OS === 'ios';
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

const AddPetService = props => {
  const {t} = props;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'red'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  editForm: {
    paddingHorizontal: 20,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default memo(withTranslation()(AddPetService));
