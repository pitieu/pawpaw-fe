// import dependencies
import React, {useState, memo} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {LongPressGestureHandler, State} from 'react-native-gesture-handler';
import {StyleSheet, Image, Text, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';

// import components
// import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import ProfileStackNavigator from './ProfileStackNavigator';

// screens
import Home from '../screens/home/Home1';
import Search from '../screens/search/Search';
import Profile from '../screens/profile/Profile';

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

// HomeNavigator
function HomeNavigator(props) {
  const {user, account} = props;
  const [showMenu, setShowMenu] = useState(false);
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
                  source={
                    account?.avatar
                      ? account?.avatar
                      : require('../assets/img/profile.jpg')
                  }
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

const styles = StyleSheet.create({});

const mapStateToProps = (state, ownProps) => () => {
  return {
    user: state.user.user,
    account: state.user.account,
  };
};

export default memo(connect(mapStateToProps, null)(HomeNavigator));
