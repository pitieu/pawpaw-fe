import React, {memo, useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';

// components
import Icon from '../icon/Icon';
import TouchableItem from '../TouchableItem';
import Divider from '../divider/Divider';

// import colors
import Colors from '../../theme/colors';
import {CHEVRON_NEXT_ICON} from '../../constants/icons';

const ListItemEdit = ({
  containerStyle,
  field = ' ',
  value,
  valueComponent,
  placeholder = ' ',
  disabled = false,
  disabledContent,
  iconBtn,
  icon,
  onPress = () => {},
  borderBottom,
  border = true,
  inputContainerStyle,
  numberOfLines,
}) => {
  return (
    <TouchableItem
      onPress={disabled ? () => {} : onPress}
      disabled={disabled}
      style={[containerStyle, styles.fieldContainer]}>
      <Text style={styles.fieldText}>{field}</Text>
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'column',
          },
          disabledContent ? {backgroundColor: Colors.lightGray} : null,
        ]}>
        {border && (
          <Divider type="inset" color={disabledContent ? Colors.white : null} />
        )}
        <View
          style={[
            styles.innerContainer,
            valueComponent ? {paddingVertical: 0} : null,
            inputContainerStyle,
            disabledContent ? {paddingHorizontal: 10} : null,
          ]}>
          {valueComponent && <View style={{flex: 1}}>{valueComponent}</View>}
          {!valueComponent && (
            <Text
              numberOfLines={numberOfLines}
              style={[
                styles.fieldValue,
                value ? {color: Colors.primaryText} : {color: Colors.gray},
                disabledContent ? {color: Colors.darkGray} : null,
              ]}>
              {value || placeholder}
            </Text>
          )}
          {iconBtn && <Text style={styles.textBtn}>{iconBtn}</Text>}
          {!iconBtn && icon && (
            <Icon
              name={icon.length > 0 ? icon : CHEVRON_NEXT_ICON}
              size={18}
              color={disabledContent ? Colors.darkGray : Colors.primaryText}
            />
          )}
        </View>
        {border && borderBottom && <Divider type="inset" />}
      </View>
    </TouchableItem>
  );
};

const styles = StyleSheet.create({
  fieldContainer: {
    flexDirection: 'row',
    paddingVertical: 0,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  fieldText: {
    color: Colors.primaryColor,
    width: 100,
  },
  fieldValue: {
    textAlign: 'left',
    flex: 1,
  },
  textBtn: {
    color: Colors.focusColor,
    fontSize: 14,
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
  },
});

export default memo(ListItemEdit);
