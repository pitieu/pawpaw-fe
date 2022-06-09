import React, {memo, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {withTranslation} from 'react-i18next';
import {StyleSheet, Image, Text, View, Platform} from 'react-native';

import MainProfile from '../screens/profile/MainProfile';

import HeaderIconButton from '../components/navigation/HeaderIconButton';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

import Icon from '../components/icon/Icon';
import {getAccount} from '../api/Account';

// import colors
import Colors from '../theme/colors';
import Layout from '../theme/layout';

const IOS = Platform.OS === 'ios';

const ProfileStack = createStackNavigator();

const getHeaderLeft = index => {
  switch (index) {
    case 3:
      return <Text style={styles.headerLeft}>Pet Services</Text>;
    case 4:
      let account = getAccount().then(() => {
        // console.log(account);
      });

      return <Text style={styles.headerLeft}>{account?.username}</Text>;
  }
  return <Text style={styles.headerLeft}></Text>;
};

const {ContextMenu, SlideInMenu, Popover} = renderers;

const ProfileStackNavigator = () => {
  let [opened, setOpened] = useState(false);
  const triggerOpen = () => {
    setOpened(!opened);
  };

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="MainProfile"
        component={MainProfile}
        options={({navigation}) => ({
          title: 'MainProfile',
          headerLeft: () => {
            return getHeaderLeft(navigation.getParent().getState().index);
          },
          headerTitle: false,
          headerRight: () => (
            <View style={{flex: 1, flexDirection: 'row'}}>
              <HeaderIconButton
                onPress={() => navigation.goBack()}
                name={'chatbox-outline'}
                color={Colors.primaryText}
              />
              <HeaderIconButton
                onPress={() => {}}
                name={'notifications-outline'}
                color={Colors.primaryText}
              />

              <Menu backHandler={opened}>
                <MenuTrigger>
                  <View style={styles.iconMenu}>
                    <Icon
                      name={'add-circle-outline'}
                      size={IOS ? 26 : 24}
                      color={Colors.primaryText}
                    />
                  </View>
                </MenuTrigger>
                <MenuOptions>
                  <MenuOption
                    onSelect={() => {
                      navigation.navigate('AddPost');
                    }}
                    style={styles.menuOption}>
                    <Icon
                      name={'add-circle-outline'}
                      size={IOS ? 26 : 24}
                      color={Colors.primaryText}
                    />
                    <Text style={styles.menuItem}>Photo/Video</Text>
                  </MenuOption>
                  <MenuOption
                    onSelect={() => {
                      navigation.navigate('ServiceStackNavigator');
                    }}
                    style={styles.menuOption}>
                    <Icon
                      name={'add-circle-outline'}
                      size={IOS ? 26 : 24}
                      color={Colors.primaryText}
                    />
                    <Text style={styles.menuItem}>Add Service</Text>
                  </MenuOption>
                  <MenuOption onSelect={() => {}} style={styles.menuOption}>
                    <Icon
                      name={'add-circle-outline'}
                      size={IOS ? 26 : 24}
                      color={Colors.primaryText}
                    />
                    <Text style={styles.menuItem}>Add Product</Text>
                  </MenuOption>
                </MenuOptions>
              </Menu>
              <HeaderIconButton
                onPress={() => {
                  navigation.navigate('Profile');
                }}
                name={'menu'}
                color={Colors.primaryText}
              />
            </View>
          ),
        })}
      />
    </ProfileStack.Navigator>
  );
};

const styles = StyleSheet.create({
  headerLeft: {
    fontWeight: 'bold',
    paddingLeft: Layout.LARGE_PADDING,
    fontSize: 20,
  },
  menuOption: {
    // justifyContent: 'space-between',
    flexDirection: 'row',
  },
  menuItem: {
    color: Colors.primaryText,
    padding: 10,
  },
  iconMenu: IOS
    ? {
        height: 26, // 24
        width: 26, // 24
        marginRight: 14,
        marginVertical: 8, // 10
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
      }
    : {
        height: 24,
        width: 24,
        margin: 3,
        justifyContent: 'center',
        alignItems: 'center',
      },
});

export default memo(withTranslation()(ProfileStackNavigator));
