// import dependencies
import React, {useEffect, useLayoutEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  useNavigation,
  useRoute,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import {StyleSheet, Image, Text, View, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import components
import HeaderIconButton from '../components/navigation/HeaderIconButton';
import TabBadgeIcon from '../components/navigation/TabBadgeIcon';
import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import BottomSheet from '../components/bottomsheet/BottomSheet';

// import Home screen
import Home from '../screens/home/Home1';

// import Search screen
import Search from '../screens/search/Search';

// import Favorites screen
import Favorites from '../screens/favorites/Favorites';

// import Cart screen
import Cart from '../screens/cart/Cart';

// import Settings screen
import Profile from '../screens/profile/Profile';
import MainProfile from '../screens/profile/MainProfile';

// import colors
import Colors from '../theme/colors';
import Layout from '../theme/layout';

// API
import {
  fetchAccounts,
  selectAccount,
  getAccount,
  getUser,
} from '../api/Account';

// create bottom tab navigator
const Tab = createBottomTabNavigator();
const ProfileStack = createStackNavigator();

// let routeName = '';

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

const ProfileStackNavigator = () => (
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
              onPress={() => navigation.goBack()}
              name={'notifications-outline'}
              color={Colors.primaryText}
            />
            <HeaderIconButton
              onPress={() => {}}
              name={'add-circle-outline'}
              color={Colors.primaryText}
            />
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

// HomeNavigator
function HomeNavigator() {
  let loaded = false;
  let accountData;
  const navigation = useNavigation();

  const onLongPress = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      let SheetView = RNBottomActionSheet.SheetView;

      const callSheet = accounts => {
        let selected = 0;
        const user = getUser();

        // dynamically create bottom sheet items
        const items = accounts.map((account, index) => {
          if (user.selected_account == account._id) {
            selected = index;
          }
          return {
            title: account.username,
            value: account._id,
            subTitle: '',
          };
        });

        SheetView.Show({
          title: 'Select account',
          items: [
            ...items,
            {
              title: 'Add Account',
              value: 'add',
              subTitle: '',
              iconName: 'add',
              // icon: {instagram},
            },
          ],
          theme: 'light',
          selection: selected,
          onSelection: (index, value) => {
            accountData = accountData.map(async account => {
              if (account._id === value) {
                AsyncStorage.setItem('@account', JSON.stringify(account)).then(
                  async () => {
                    await selectAccount(value);
                    // move quickly to home and back to profile to trigger a refresh
                    // Todo: find a better solution ?
                    navigation.navigate('Marketplace');
                    navigation.navigate('ProfileTab');
                  },
                );
              }
              return account;
            });
          },
        });
      };
      // we don't need to query over and over the server for accounts
      if (!loaded) {
        fetchAccounts().then(accounts => {
          accountData = accounts.data;
          loaded = !loaded;
          callSheet(accounts.data);
        });
      } else {
        callSheet(accountData);
      }
    }
  };

  return (
    <Tab.Navigator
      initialRouteName="ProfileTab"
      backBehavior="initialRoute"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}) => {
          let iconName;
          if (route.name === 'Explore') {
            iconName = 'magnify';
          } else if (route.name === 'ProfileTab') {
            iconName = `account-settings${focused ? '' : '-outline'}`;
          } else if (route.name === 'Home') {
            iconName = `home${focused ? '' : '-outline'}`;
          } else if (route.name === 'Marketplace') {
            iconName = 'store';
          } else if (route.name === 'Pet Services') {
            iconName = 'dog-service';
          }

          if (route.name === 'ProfileTab') {
            return (
              <LongPressGestureHandler
                onHandlerStateChange={onLongPress}
                minDurationMs={1000}>
                <Image
                  source={require('../assets/img/profile.jpg')}
                  style={{
                    borderRadius: 28,
                    borderWidth: 1,
                    borderColor: Colors.primaryColor,
                    width: 24,
                    height: 24,
                  }}
                />
              </LongPressGestureHandler>
            );
          } else {
            // You can return any component that you like here!
            return <Icon name={iconName} size={size} color={color} />;
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.primaryColor,
        inactiveTintColor: Colors.secondaryText,
        showLabel: true,
        style: {
          backgroundColor: Colors.surface, // TabBar background
        },
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Explore" component={Search} />
      <Tab.Screen name="Marketplace" component={Profile} />
      <Tab.Screen name="Pet Services" component={ProfileStackNavigator} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={({navigation}) => ({
          title: 'Profile',
        })}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  headerLeft: {
    fontWeight: 'bold',
    paddingLeft: Layout.LARGE_PADDING,
    fontSize: 20,
  },
  androidMenu: {
    marginBottom: 20,
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 100,
  },
  iosMenu: {
    bottom: 5,
    backgroundColor: Colors.primaryColor,
    padding: 10,
    borderRadius: 100,
    position: 'absolute',
  },
});

export default HomeNavigator;
