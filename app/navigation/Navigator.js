// import dependencies
import React from 'react';
import {Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';

// import components
import HeaderIconButton from '../components/navigation/HeaderIconButton';

// import Navigators
import HomeNavigator from './HomeNavigator';
import ServiceStackNavigator from './ServiceStackNavigator';

// import Introduction screen
import Intro from '../screens/introduction/Introduction';

// import Welcome screen
import Welcome from '../screens/welcome/Welcome';

// import SignUp screen
import SignUp from '../screens/signup/SignUp';

// import SignIn screen
import SignIn from '../screens/signin/SignIn';

// import ForgotPassword screen
import ForgotPassword from '../screens/forgotpassword/ForgotPassword';

// import TermsConditions screen
import TermsConditions from '../screens/terms/TermsConditions';

// import Product screen
import Product from '../screens/product/Product';
import ProductDetails from '../screens/product/ProductDetails';
import ServiceDetails from '../screens/services/PetServiceDetails';

import Cart from '../screens/cart/Cart';
import Favorites from '../screens/favorites/Favorites';

// import Categories screen
import Categories from '../screens/categories/Categories';
import Category from '../screens/categories/Category';

// import Search results screen
import SearchResults from '../screens/search/SearchResults';

// import Checkout screen
import Checkout from '../screens/checkout/Checkout';

// import EditProfile screen
import Profile from '../screens/profile/Profile';
import LongLatMap from '../screens/profile/LongLatMap';
import Address from '../screens/profile/Address';
import AddressList from '../screens/profile/AddressList';
import EditProfile from '../screens/profile/EditProfile';

// import Payment screen
import PaymentMethod from '../screens/payment/PaymentMethod';

// import AddCreditCard screen
import AddCreditCard from '../screens/payment/AddCreditCard';

// import Notifications screen
import Notifications from '../screens/notifications/Notifications';

// import Orders screen
import Orders from '../screens/orders/Orders';

// import AboutUs screen
import AboutUs from '../screens/about/AboutUs';

// import colors
import Colors from '../theme/colors';

// MainNavigatorA Config
const SAVE_ICON = Platform.OS === 'ios' ? 'ios-checkmark' : 'md-checkmark';

// create stack navigator
const Stack = createStackNavigator();

// MainNavigatorA
function MainNavigatorA() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        //"PetServiceDetails" "ServiceStackNavigator" "SignIn"
        initialRouteName="HomeNavigator" //HomeNavigator
        screenOptions={{
          cardOverlayEnabled: false,
          headerStyle: {
            elevation: 1,
            shadowOpacity: 0,
          },
          headerBackTitleVisible: false,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerTintColor: Colors.onBackground,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="PetServiceDetails"
          component={ProductDetails}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Address"
          component={Address}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="AddressList"
          component={AddressList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LongLatMap"
          component={LongLatMap}
          options={{headerShown: false}}
        />
        {/* <Stack.Screen
          name="ProductDetail"
          component={ProductDetails}
          options={{headerShown: false}}
        /> */}
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={({navigation}) => ({
            title: 'Profile',
            headerLeft: () => (
              <Icon
                onPress={() => {
                  navigation.goBack();
                }}
                name={'close'}
                size={26}
                color={Colors.primaryText}
                style={{paddingLeft: 18}}
              />
            ),
          })}
        />

        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Product"
          component={Product}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Onboarding"
          component={Intro}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
            title: 'Forgot Password?',
          }}
        />
        <Stack.Screen
          name="TermsConditions"
          component={TermsConditions}
          options={{
            title: 'Terms and Conditions',
          }}
        />
        <Stack.Screen
          name="ServiceStackNavigator"
          component={ServiceStackNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeNavigator"
          component={HomeNavigator}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="Categories"
          component={Categories}
          options={{
            title: 'All Categories',
          }}
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{
            title: 'Pizza',
          }}
        />

        <Stack.Screen
          name="SearchResults"
          component={SearchResults}
          options={{
            title: 'Search Results',
          }}
        />
        <Stack.Screen
          name="Checkout"
          component={Checkout}
          options={{
            title: 'Checkout',
            headerStyle: {
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />

        <Stack.Screen
          name="PaymentMethod"
          component={PaymentMethod}
          options={({navigation}) => ({
            title: 'Payment Method',
            headerRight: () => (
              <HeaderIconButton
                onPress={() => navigation.goBack()}
                name={SAVE_ICON}
                color={Colors.primaryColor}
              />
            ),
          })}
        />
        <Stack.Screen
          name="AddCreditCard"
          component={AddCreditCard}
          options={{
            title: 'Add Credit Card',
          }}
        />
        <Stack.Screen
          name="Notifications"
          component={Notifications}
          options={{
            title: 'Notifications',
          }}
        />
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{
            title: 'My Orders',
          }}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{
            title: 'About Us',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigatorA;
