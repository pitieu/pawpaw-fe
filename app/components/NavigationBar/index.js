import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import Colors from '../../theme/colors';
import {CHEVRON_BACK_ICON} from '../../constants/icons';

const NavigationBar = ({
  callback,
  onPressBack,
  title,
  buttonText,
  onPressNext,
  buttonCustom,
  titleCustom,
  navigationStyle = {},
}) => {
  const _onCallBack = () => {
    if (onPressBack) {
      onPressBack();
    } else if (callback) callback();
  };
  return (
    <View style={[styles.navigationBar, navigationStyle]}>
      <TouchableOpacity onPress={_onCallBack} style={styles.btnBack}>
        <Icon name={CHEVRON_BACK_ICON} size={26} />
      </TouchableOpacity>
      {!titleCustom && <Text style={styles.title}>{title}</Text>}
      {titleCustom}
      {!buttonCustom && (
        <TouchableOpacity onPress={onPressNext}>
          <Text style={styles.btnNext}>{buttonText}</Text>
        </TouchableOpacity>
      )}
      {buttonCustom}
    </View>
  );
};

export default NavigationBar;

const styles = StyleSheet.create({
  navigationBar: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    height: 44,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ddd',
    // borderBottomWidth: 1,
  },
  btnBack: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
  },
  btnNext: {
    color: Colors.focusColor,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
