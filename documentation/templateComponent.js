// import dependencies
import React, {memo, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {withTranslation} from 'react-i18next';

// import components
import Icon from '../../../components/icon/Icon';
import {Subtitle1, Subtitle2} from '../../../components/text/CustomText';
import NavigationBar from '../../../components/NavigationBar';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const AddServiceOptions = props => {
  const {t, navigation, route} = props;

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

export default memo(withTranslation()(AddServiceOptions));
