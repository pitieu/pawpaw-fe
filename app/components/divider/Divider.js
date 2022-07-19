// import dependencies
import React from 'react';
import {StyleSheet, View} from 'react-native';

// Divider Styles
const styles = StyleSheet.create({
  container: {
    height: 1,
  },
  mh16: {
    marginHorizontal: 16,
  },
});

// Divider
const Divider = ({containerStyle, marginLeft, type, color}) => (
  <View
    style={[
      styles.container,
      type === 'inset' && {marginLeft},
      type === 'middle' && styles.mh16,
      {backgroundColor: color ? color : '#eeeeee'},
      containerStyle,
    ]}
  />
);

export default Divider;
