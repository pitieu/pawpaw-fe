// import dependencies
import React, {memo, useState} from 'react';
import {SafeAreaView, StyleSheet, View, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {t} from 'i18next';

// import components
import Icon from '../../components/icon/Icon';
import NavigationBar from '../../components/NavigationBar';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const AddressList = props => {
  const {route} = props;
  const navigation = useNavigation();

  const [addressList, setAddressList] = useState([]);

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const renderAddress = _address => {
    <Text style={styles.address}>{_address}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={t('address_list_title')}
        onPressNext={() => navigateTo('AddServiceDetails', {})}
      />
      {addressList &&
        addressList.map(address => {
          renderAddress(address);
        })}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  address: {},
});

export default memo(AddressList);
