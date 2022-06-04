// import dependencies
import React, {useState, memo} from 'react';
import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import {withTranslation} from 'react-i18next';

// components
import UploadImage from '../../../components/image/uploadImage';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

const IOS = Platform.OS === 'ios';

const AddPetService = props => {
  const {t} = props;

  const onChange = photo => {
    // console.log(photo);
  };

  return (
    <SafeAreaView style={styles.container}>
      <UploadImage onChange={onChange} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default memo(withTranslation()(AddPetService));
