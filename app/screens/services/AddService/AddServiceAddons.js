// import dependencies
import React, {memo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView, StatusBar, StyleSheet, View} from 'react-native';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import components
import Icon from '../../../components/icon/Icon';
import {Subtitle1, Subtitle2} from '../../../components/text/CustomText';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const AddServiceAddons = props => {
  const {t} = props;
  return <Text>Service Addons</Text>;
};

const styles = StyleSheet.create({});

export default memo(withTranslation()(AddServiceAddons));
