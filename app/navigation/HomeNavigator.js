// import dependencies
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// import components
import TabBadgeIcon from '../components/navigation/TabBadgeIcon';

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
import {StyleSheet} from 'react-native';

// create bottom tab navigator
const Tab = createBottomTabNavigator();

// HomeNavigator
function HomeNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Profile"
      backBehavior="initialRoute"
      screenOptions={({route}) => ({
        tabBarIcon: ({color, focused, size}) => {
          let iconName;
          if (route.name === 'Search') {
            iconName = 'magnify';
          } else if (route.name === 'Favorites') {
            iconName = `heart${focused ? '' : '-outline'}`;
          } else if (route.name === 'Profile') {
            iconName = `account-settings${focused ? '' : '-outline'}`;
          } else if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Store') {
            iconName = 'store';
          } else if (route.name === 'Graph') {
            iconName = 'dog-service';
          }

          // You can return any component that you like here!
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: Colors.primaryColor,
        inactiveTintColor: Colors.secondaryText,
        showLabel: false, // hide labels
        style: {
          backgroundColor: Colors.surface, // TabBar background
        },
      }}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Search" component={Search} />
      <Tab.Screen
        name="Store"
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

      <Tab.Screen name="Graph" component={Favorites} />

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
