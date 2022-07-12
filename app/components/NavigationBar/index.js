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
  buttonRightIcon,
  onPressButtonRight,
  border,
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
    <View
      style={[
        styles.navigationBar,
        navigationStyle,
        border
          ? {borderBottomWidth: 1, borderBottomColor: Colors.lightGray}
          : null,
      ]}>
      <TouchableOpacity onPress={backPressed} style={styles.btnBack}>
        <Icon name={CHEVRON_BACK_ICON} size={26} />
      </TouchableOpacity>
      {!titleCustom && (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}
      {titleCustom}
      <View
        style={{
          justifyContent: 'flex-end',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {buttonRightIcon && (
          <TouchableOpacity onPress={onPressButtonRight} style={styles.btnBack}>
            <Icon name={buttonRightIcon} size={26} />
          </TouchableOpacity>
        )}
        {!buttonCustom && buttonNextText && (
          <TouchableOpacity onPress={onPressNext}>
            <Text style={styles.btnNext}>{buttonNextText}</Text>
          </TouchableOpacity>
        )}
        {!buttonCustom && !buttonNextText && !buttonRightIcon && (
          <View style={styles.placeholderView}></View>
        )}
      </View>
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
  },
  btnBack: {
    height: 44,
    marginLeft: 16,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    // Todo: adjust maxWidth based on what's available
    maxWidth: '60%',
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
