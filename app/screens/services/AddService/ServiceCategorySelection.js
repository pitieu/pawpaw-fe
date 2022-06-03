import React, {memo, useState} from 'react';
import {withTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

import {
  StyleSheet,
  View,
  Text,
  Platform,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';

// component
import {Subtitle1} from '../../../components/text/CustomText';
import Divider from '../../../components/divider/Divider';

import Icon from '../../../components/icon/Icon';
import TouchableItem from '../../../components/TouchableItem';

// import colors
import Colors from '../../../theme/colors';
import Layout from '../../../theme/layout';

var {width, height} = Dimensions.get('window');

const IOS = Platform.OS === 'ios';
const EXIT_ICON = IOS ? 'ios-exit-outline' : 'md-exit-outline';

const DIVIDER_MARGIN_LEFT = 120;

const Setting = ({image, icon, title, onPress, extraData}) => (
  <TouchableItem onPress={onPress}>
    <View>
      <View style={[styles.row, styles.setting]}>
        {icon !== undefined && (
          <View style={styles.iconContainer}>
            <Icon name={icon} size={24} color={Colors.primaryText} />
          </View>
        )}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/img/profile_2.jpeg')}
            style={styles.image}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.mediumText}>{title}</Text>
          <Text
            numberOfLines={5}
            ellipsizeMode="tail"
            style={styles.extraDataText}>
            {extraData || ''}
          </Text>
        </View>
      </View>
    </View>
  </TouchableItem>
);

const ServiceCategorySelection = () => {
  const navigation = useNavigation();
  //   navigation.setOptions({headerTitle: 'Updated!'});
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.statusBarColor}
        barStyle="dark-content"
      />
      <View style={styles.settingGroup}>
        <Setting
          onPress={() => {
            navigation.navigate('AddPetService', {service: 'grooming'});
          }}
          image="sa"
          title="Grooming"
          extraData="Cleaning and taking care of pet animals hygienically. It can be done at your store or at the customer's place. Decide what kind of grooming you can offer to our users! Cleaning and taking care of pet animals hygienically. It can be done at your store or at the customer's place. Decide what kind of grooming you can offer to our users!"
        />
        <Divider marginLeft={DIVIDER_MARGIN_LEFT} />
        <Setting
          onPress={() => {
            navigation.navigate('AddPetService', {service: 'pet_sitting'});
          }}
          image="sa"
          title="Pet Sitting"
          extraData="Temporarily taking care of our customer's pet. The service will be delivered at the pet owner's home.  Pet sitting service will be done for at least 24 hrs, while Day Care service will be done for 8hrs."
        />
        <Divider marginLeft={DIVIDER_MARGIN_LEFT} />
        <Setting
          onPress={() => {
            navigation.navigate('AddPetService', {service: 'pet_hotel'});
          }}
          image="sa"
          title="Pet Hotel"
          extraData="Similar service with pet sitting but it takes place at your store. Decide how you will take care of the animals and the duration of the service."
        />
        <Divider marginLeft={DIVIDER_MARGIN_LEFT} />
        <Setting
          onPress={() => {
            navigation.navigate('AddPetService', {service: 'pet_walking'});
          }}
          image="sa"
          title="Pet Walking"
          extraData="Walking with pet animals from the pet owner's house to designated place and then returning. Decide the duration of the service."
        />
        <Divider marginLeft={DIVIDER_MARGIN_LEFT} />
        <Setting
          onPress={() => {
            navigation.navigate('AddPetService', {service: 'others'});
          }}
          image="sa"
          title="Other Services"
          extraData=""
        />
        <Divider marginLeft={DIVIDER_MARGIN_LEFT} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: 'flex-start',
    // flexDirection: 'row',
    backgroundColor: Colors.background,
  },
  //   settingGroup: {flexDirection: 'column'},
  imageContainer: {
    padding: Layout.LARGE_PADDING,
  },
  image: {
    width: 100,
    height: 100,
  },
  iconContainer: {
    paddingRight: Layout.LARGE_PADDING,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    // paddingHorizontal: 16,
  },

  extraData: {
    // textAlign: 'left',
  },
  extraDataText: {},
  mediumText: {
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 8,
  },
  textContainer: {
    flex: 1,
    paddingRight: Layout.LARGE_PADDING,
  },
  setting: {
    maxHeight: 150,
  },
});

export default memo(withTranslation()(ServiceCategorySelection));
