import React, {memo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {withTranslation} from 'react-i18next';
import {StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import ServiceCategorySelection from '../screens/services/AddService/ServiceCategorySelection';
import AddPetService from '../screens/services/AddService/AddPetService';
import AddServiceDelivery from '../screens/services/AddService/AddServiceDelivery';
import AddServiceDetail from '../screens/services/AddService/AddServiceDetails';
import AddServiceOptions from '../screens/services/AddService/AddServiceOptions';
import AddServiceAddons from '../screens/services/AddService/AddServiceAddons';

// import colors
import Colors from '../theme/colors';
import Layout from '../theme/layout';

const IOS = Platform.OS === 'ios';
('chevron-back');
const ServiceStack = createStackNavigator();
const CHEVRON_ICON = IOS ? 'ios-chevron-back' : 'md-chevron-back';

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
      name={CHEVRON_ICON}
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
        name="AddServiceDetail"
        component={AddServiceDetail}
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
    </ServiceStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default memo(withTranslation()(ServiceStackNavigator));
