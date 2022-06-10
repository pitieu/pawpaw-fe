import React, {memo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {withTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import ServiceCategorySelection from '../screens/services/AddService/ServiceCategorySelection';
import AddPetService from '../screens/services/AddService/AddPetService';
import AddServiceDelivery from '../screens/services/AddService/AddServiceDelivery';
import AddServiceDetails from '../screens/services/AddService/AddServiceDetails';
import AddServiceOptions from '../screens/services/AddService/AddServiceOptions';
import AddServiceAddons from '../screens/services/AddService/AddServiceAddons';
import FullscreenInput from '../screens/services/AddService/FullscreenInput';
import Test from '../screens/services/AddService/Test';
import Test2 from '../screens/services/AddService/Test2';

// import utils
import Colors from '../theme/colors';
import Layout from '../theme/layout';
import {CHEVRON_BACK_ICON} from '../constants/icons';

const ServiceStack = createStackNavigator();

const ServiceStackNavigator = ({navigation}) => {
  const closeButton = () => (
    <Icon
      onPress={() => {
        navigation.goBack();
      }}
      name={'close'}
      size={26}
      color={Colors.primaryText}
      style={{paddingLeft: Layout.LARGE_PADDING}}
    />
  );
  const backButton = () => (
    <Icon
      onPress={() => {
        navigation.goBack();
      }}
      name={CHEVRON_BACK_ICON}
      size={26}
      color={Colors.primaryText}
      style={{paddingLeft: Layout.LARGE_PADDING}}
    />
  );
  return (
    <ServiceStack.Navigator>
      <ServiceStack.Screen
        name="ServiceCategorySelection"
        options={({navigation}) => ({
          title: 'Select Service Category',
          headerTitleAlign: 'left',
          headerLeft: closeButton,
        })}
        component={ServiceCategorySelection}
      />

      <ServiceStack.Screen
        name="AddPetService"
        component={AddPetService}
        options={({navigation}) => ({
          title: 'Sell Pet Service',
          headerTitleAlign: 'left',
          headerLeft: backButton,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceDetails"
        component={AddServiceDetails}
        options={({navigation}) => ({
          title: 'Add Service Details',
          headerTitleAlign: 'left',
          headerLeft: backButton,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceDelivery"
        component={AddServiceDelivery}
        options={({navigation}) => ({
          title: 'Add Service Delivery',
          headerTitleAlign: 'left',
          headerLeft: backButton,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceOptions"
        component={AddServiceOptions}
        options={({navigation}) => ({
          title: 'Add Service Options',
          headerTitleAlign: 'left',
          headerLeft: backButton,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceAddons"
        component={AddServiceAddons}
        options={({navigation}) => ({
          title: 'Add Service Addons',
          headerTitleAlign: 'left',
          headerLeft: backButton,
        })}
      />
      <ServiceStack.Screen
        name="FullscreenInput"
        component={FullscreenInput}
        options={({navigation}) => ({
          title: 'Service Description',
          headerTitleAlign: 'left',
          headerLeft: backButton,
        })}
      />
      <ServiceStack.Screen
        name="Test"
        component={Test}
        options={({navigation}) => ({
          headerLeft: false,
          headerRight: false,
          headerShown: false,
        })}
      />
      <ServiceStack.Screen
        name="Test2"
        component={Test2}
        options={({navigation}) => ({
          headerLeft: false,
          headerRight: false,
          headerShown: false,
        })}
      />
    </ServiceStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default memo(withTranslation()(ServiceStackNavigator));
