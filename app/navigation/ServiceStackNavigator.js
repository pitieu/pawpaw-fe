import React, {memo} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {withTranslation} from 'react-i18next';
import {StyleSheet, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/dist/Ionicons';

import ServiceCategorySelection from '../screens/services/AddService/ServiceCategorySelection';
import AddPetService from '../screens/services/AddService/AddPetService';

// import colors
import Colors from '../theme/colors';
import Layout from '../theme/layout';

const IOS = Platform.OS === 'ios';
('chevron-back');
const ServiceStack = createStackNavigator();
const CHEVRON_ICON = IOS ? 'ios-chevron-back' : 'md-chevron-back';

const ServiceStackNavigator = () => {
  return (
    <ServiceStack.Navigator>
      <ServiceStack.Screen
        name="ServiceCategorySelection"
        options={({navigation}) => ({
          title: 'Select Service Category',
          headerTitleAlign: 'left',
          headerLeft: () => (
            <Icon
              onPress={() => {
                navigation.goBack();
              }}
              name={'close'}
              size={26}
              color={Colors.primaryText}
              style={{paddingLeft: Layout.LARGE_PADDING}}
            />
          ),
        })}
        component={ServiceCategorySelection}></ServiceStack.Screen>
      <ServiceStack.Screen
        name="AddPetService"
        component={AddPetService}
        options={({navigation}) => ({
          title: 'Sell Pet Service',
          headerTitleAlign: 'left',
          headerLeft: () => (
            <Icon
              onPress={() => {
                navigation.goBack();
              }}
              name={CHEVRON_ICON}
              size={26}
              color={Colors.primaryText}
              style={{paddingLeft: Layout.LARGE_PADDING}}
            />
          ),
        })}></ServiceStack.Screen>
    </ServiceStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default memo(withTranslation()(ServiceStackNavigator));
