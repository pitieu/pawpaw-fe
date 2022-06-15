import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../theme/colors';
import {CHEVRON_BACK_ICON} from '../../constants/icons';

const NavigationBar = ({
  onPressBack,
  title,
  buttonNextText,
  onPressNext,
  buttonCustom,
  titleCustom,
  navigationStyle = {},
}) => {
  const navigation = useNavigation();

  const backPressed = () => {
    if (onPressBack) {
      onPressBack();
    } else {
      navigation.goBack();
    }
  };
  return (
    <View style={[styles.navigationBar, navigationStyle]}>
      <TouchableOpacity onPress={backPressed} style={styles.btnBack}>
        <Icon name={CHEVRON_BACK_ICON} size={26} />
      </TouchableOpacity>
      {!titleCustom && <Text style={styles.title}>{title}</Text>}
      {titleCustom}
      {!buttonCustom && buttonNextText && (
        <TouchableOpacity onPress={onPressNext}>
          <Text style={styles.btnNext}>{buttonNextText}</Text>
        </TouchableOpacity>
      )}
      {!buttonCustom && !buttonNextText && (
        <View style={styles.placeholderView}></View>
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
    marginLeft: 16,
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
    marginRight: 16,
  },
  placeholderView: {
    width: 44,
    marginRight: 16,
  },
});
