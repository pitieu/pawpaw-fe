/**
 * Foodvila - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import FAIcon from 'react-native-vector-icons/dist/FontAwesome';
import IcoMoon from '../icon/Icomoon';

// import components
import {ButtonText} from '../text/CustomText';
import TouchableItem from '../TouchableItem';

// import colors
import Colors from '../../theme/colors';

// OutlinedButton Config
const BUTTON_BORDER_RADIUS = 4;
const BUTTON_HEIGHT = 44;
const BUTTON_WIDTH = '100%';

// OutlinedButton Styles
const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, .12)',
    borderRadius: BUTTON_BORDER_RADIUS,
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  outlinedButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 32,
    maxWidth: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
  },
  rounded: {
    borderRadius: BUTTON_HEIGHT / 2,
  },
  socialIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: 52,
  },
  iconContainer: {
    marginLeft: 12,
  },
  pl8: {
    paddingLeft: 8,
  },
  title: {
    paddingHorizontal: 16,
    color: Colors.primaryColor,
    textAlign: 'center',
  },
});

// OutlinedButton
const OutlinedButton = ({
  onPress,
  activeOpacity = 0.85,
  buttonStyle,
  height,
  borderColor,
  borderRadius,
  color,
  iconColor,
  iconName,
  socialIconName,
  iconMoonName,
  title,
  titleColor,
  rippleColor = Colors.primaryColor,
  rounded,
  disabled,
}) => {
  return (
    <View
      style={[
        styles.container,
        color && {backgroundColor: color},
        borderColor && {borderColor},
        borderRadius && {borderRadius},
        rounded && styles.rounded,
        height && rounded && {borderRadius: height / 2},
        buttonStyle,
      ]}>
      <TouchableItem
        disabled={disabled}
        onPress={onPress}
        activeOpacity={activeOpacity}
        rippleColor={rippleColor}>
        <View style={[styles.outlinedButton, height && {height}]}>
          {socialIconName && (
            <View style={styles.socialIconContainer}>
              <FAIcon name={socialIconName} size={20} color={iconColor} />
            </View>
          )}
          {iconName && (
            <View
              style={[
                styles.iconContainer,
                title?.length ? {} : {marginRight: 6},
              ]}>
              <Icon name={iconName} size={18} color={iconColor} />
            </View>
          )}
          {iconMoonName && (
            <View style={styles.iconContainer}>
              <IcoMoon name={iconMoonName} size={18} color={iconColor} />
            </View>
          )}
          <ButtonText
            style={[
              styles.title,
              titleColor && {color: titleColor},
              iconName && styles.pl8,
              iconMoonName && styles.pl8,
              title?.length ? {} : {paddingHorizontal: 0},
            ]}>
            {title !== undefined ? title.toUpperCase() : ''}
          </ButtonText>
        </View>
      </TouchableItem>
    </View>
  );
};

export default OutlinedButton;
