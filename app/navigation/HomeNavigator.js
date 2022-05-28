// import dependencies
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import {StyleSheet, Image, Text, View, Icon as Iconn} from 'react-native';

// import components
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
import Settings from '../screens/settings/Settings';
import Profile from '../screens/profile/Profile';

// import colors
import Colors from '../theme/colors';

// API
import {getAccounts, selectAccount} from '../api/Account';

// create bottom tab navigator
const Tab = createBottomTabNavigator();

// HomeNavigator
function HomeNavigator() {
  let loaded = false;
  let accountData;

  const onLongPress = event => {
    if (event.nativeEvent.state === State.ACTIVE) {
      let SheetView = RNBottomActionSheet.SheetView;

      const callSheet = accounts => {
        let selected = 0;
        // dynamically create bottom sheet items
        const items = accounts.map((account, index) => {
          if (account.selected_account) {
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
            accountData = accountData.map(account => {
              account.selected_account = account._id === value;
              return account;
            });
            selectAccount(value);
          },
        });
      };
      // we don't need to query over and over the server for accounts
      if (!loaded) {
        getAccounts().then(accounts => {
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
      initialRouteName="Profile"
      backBehavior="initialRoute"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}) => {
          let iconName;
          if (route.name === 'Explore') {
            iconName = 'magnify';
          } else if (route.name === 'Profile') {
            iconName = `account-settings${focused ? '' : '-outline'}`;
          } else if (route.name === 'Home') {
            iconName = `home${focused ? '' : '-outline'}`;
          } else if (route.name === 'Marketplace') {
            iconName = 'store';
          } else if (route.name === 'Pet Services') {
            iconName = 'dog-service';
          }

          if (route.name === 'Profile') {
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
        showLabel: true, // hide labels
        style: {
          backgroundColor: Colors.surface, // TabBar background
        },
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Explore" component={Search} />
      <Tab.Screen
        name="Marketplace"
        component={Cart}
        // options={{
        //   tabBarIcon: props => (
        //     <TabBadgeIcon
        //       name={`store${props.focused ? '' : '-outline'}`}
        //       badgeCount={5}
        //       {...props}
        //     />
        //   ),
        // }}
      />

      <Tab.Screen name="Pet Services" component={Favorites} />

      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
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
