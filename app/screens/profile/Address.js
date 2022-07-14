// import dependencies
import React, {memo, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// import components
import Icon from '../../components/icon/Icon';
import NavigationBar from '../../components/NavigationBar';
import {t} from 'i18next';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const AddServiceOptions = props => {
  const {route} = props;
  const navigation = useNavigation();

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={t('add_service_details_title')}
        buttonNextText={t('btnNext')}
        onPressNext={() => navigateTo('AddServiceDetails', {})}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default memo(AddServiceOptions);
