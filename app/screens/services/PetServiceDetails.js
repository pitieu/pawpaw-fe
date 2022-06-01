import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {withTranslation} from 'react-i18next';

const PetServiceDetails = ({route}) => {
  const {id} = route.params;

  return (
    <View>
      <Text>Pet Service Detail {id}</Text>
    </View>
  );
};
const styles = StyleSheet.create({});

export default memo(withTranslation()(PetServiceDetails));
