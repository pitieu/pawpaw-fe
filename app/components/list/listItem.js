// import dependencies
import React, {memo, useState, useMemo} from 'react';
import {Dimensions, Text, StyleSheet, View, Platform} from 'react-native';

// import components
import Icon from '../../components/icon/Icon';
import {Subtitle1, Subtitle2} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

export const {width, height} = Dimensions.get('window');

const IOS = Platform.OS === 'ios';

const ListItem = props => {
  const {
    t,
    extraData,
    icon,
    title,
    onPress,
    actionIconColor,
    actionIcon,
    disabled,
    titleColor,
    titleStyle,
  } = props;

  const _titleStyle = useMemo(
    () => [
      styles.title,
      {color: disabled ? Colors.gray : Colors.primaryText},
      titleStyle,
    ],
    [disabled],
  );
  const subtitleStyle = useMemo(
    () => [styles.subtitle, disabled ? {color: Colors.gray} : {}],
    [disabled],
  );

  return (
    <TouchableItem onPress={disabled ? () => {} : onPress}>
      <View style={styles.container}>
        <View style={[styles.row, styles.setting]}>
          <View style={styles.leftSide}>
            {icon !== undefined && (
              <View style={styles.iconContainer}>
                <Icon
                  name={IOS ? `ios-${icon}` : `md-${icon}`}
                  size={24}
                  color={Colors.primaryText}
                />
              </View>
            )}
            <View style={styles.textContainer}>
              <Subtitle1 style={[_titleStyle, {color: titleColor}]}>
                {title}
              </Subtitle1>
              {extraData && (
                <Subtitle2
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={subtitleStyle}>
                  {extraData}
                </Subtitle2>
              )}
            </View>
          </View>
        </View>
        {actionIcon && (
          <Icon
            name={IOS ? `ios-${actionIcon}` : `md-${actionIcon}`}
            size={20}
            color={
              disabled ? Colors.gray : actionIconColor || Colors.primaryText
            }
            style={styles.actionStyle}
          />
        )}
      </View>
    </TouchableItem>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Layout.LARGE_PADDING,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'green',
  },
  iconContainer: {
    paddingRight: Layout.LARGE_PADDING,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'column',
  },
  title: {
    fontWeight: '500',
  },
  subtitle: {
    textAlign: 'left',
    maxWidth: width - 60,
  },
  setting: {
    height: 26,
  },
  actionStyle: {
    marginRight: 20,
  },
});

export default memo(ListItem);
