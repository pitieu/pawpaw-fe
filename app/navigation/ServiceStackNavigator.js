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
import AddServiceOption from '../screens/services/AddService/AddServiceOption';
import AddServiceAddons from '../screens/services/AddService/AddServiceAddons';
import AddServiceAddon from '../screens/services/AddService/AddServiceAddon';
import FullscreenInput from '../screens/services/AddService/FullscreenInput';

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
    <ServiceStack.Navigator initialRouteName="ServiceCategorySelection">
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
          headerShown: false,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceDetails"
        component={AddServiceDetails}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceDelivery"
        component={AddServiceDelivery}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceOptions"
        component={AddServiceOptions}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceOption"
        component={AddServiceOption}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceAddons"
        component={AddServiceAddons}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
      <ServiceStack.Screen
        name="AddServiceAddon"
        component={AddServiceAddon}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
      <ServiceStack.Screen
        name="FullscreenInput"
        component={FullscreenInput}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
    </ServiceStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default memo(withTranslation()(ServiceStackNavigator));
