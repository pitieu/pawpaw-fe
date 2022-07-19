// import dependencies
import React, {memo, useState, useRef, useMemo} from 'react';

import {SafeAreaView, StyleSheet, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {t} from 'i18next';
import PhoneInput from 'react-native-phone-number-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

// import components
import NavigationBar from '../../components/NavigationBar';
import ListItemEdit from '../../components/list/listItemEdit';
import {Title} from '../../components/text/CustomText';
import Divider from '../../components/divider/Divider';
// import SelectCity from './SelectCity';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const AddServiceOptions = props => {
  const {route} = props;
  const navigation = useNavigation();

  const snapPointsCity = useMemo(() => [1, '100%'], []);

  const deliveryNameComponent = useRef(null);
  const phoneComponent = useRef(null);
  const phone2Component = useRef(null);
  const cityComponent = useRef(null);
  const postalCodeComponent = useRef(null);
  const addressComponent = useRef(null);
  const addressNameComponent = useRef(null);
  const [deliveryName, setDeliveryName] = useState(
    route?.params?.deliveryName || '',
  );
  const [phone, setPhone] = useState(route?.params?.phone || '');
  const [phoneExt, setPhoneExt] = useState(route?.params?.phoneExt || '');
  const [addressName, setAddressName] = useState(
    route?.params?.addressName || '',
  );
  const [city, setCity] = useState(route?.params?.city || '');
  const [postalCode, setPostalCode] = useState(route?.params?.postalCode || '');
  const [address, setAddress] = useState(route?.params?.address || '');
  const [pinLocation, setPinLocation] = useState(
    route?.params?.pinLocation || null,
  );

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const focusOn = nextFiled => () => {
    console.log(nextFiled);
    if (nextFiled?.current) {
      nextFiled.current.focus();
    }
  };

  const showBottomSheet = useCallback((type, index) => {
    if (type === 'city') {
      cityComponent.current?.snapToIndex(index);
    }
  }, []);

  const save = () => {
    route?.params?.addressList?.push({
      delivery_name: deliveryName,
      phone: phone,
      phone_ext: phoneExt,
      address_name: addressName,
      city: city,
      postal_code: postalCode,
      address: address,
      pin_location: pinLocation,
    });
    navigateTo('AddressList', {
      addressList: addressList,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationBar
        title={t('add_address_title')}
        buttonBackText={t('cancel')}
        buttonNextText={t('save')}
        onPressNext={() => save}
      />
      <KeyboardAwareScrollView enableOnAndroid>
        <View style={styles.editForm}>
          <Divider color={Colors.lightGray} containerStyle={styles.divider} />
          <Title style={styles.title}>{t('recipient_information_title')}</Title>
          <ListItemEdit
            field={t('input_delivery_name_field')}
            valueComponent={
              <TextInput
                ref={deliveryNameComponent}
                onSubmitEditing={focusOn(phoneComponent)}
                value={deliveryName}
                placeholder={t('input_delivery_name_placeholder')}
                onChangeText={setDeliveryName}
                returnKeyType={'next'}
                style={styles.inputField}
              />
            }
          />
          <ListItemEdit
            field={t('input_phone_field')}
            borderBottom
            value={`+${phoneExt} ${phone}`}
            valueComponent={
              <PhoneInput
                ref={phone2Component}
                defaultValue={phone}
                placeholder={t('input_phone_placeholder')}
                defaultCode="ID"
                layout="first"
                keyboardType="phone-pad"
                onChangeText={_phone => {
                  setPhone(_phone);
                  if (phone2Component?.current)
                    setPhoneExt(phone2Component?.current?.getCallingCode());
                }}
                containerStyle={styles.containerStyle}
                textContainerStyle={styles.textContainerStyle}
                textInputStyle={styles.textInputStyle}
                codeTextStyle={styles.codeTextStyle}
                flagButtonStyle={styles.flagButtonStyle}
                countryPickerButtonStyle={styles.countryPickerButtonStyle}
                textInputProps={{
                  ref: phoneComponent,
                  onSubmitEditing: focusOn(addressComponent),
                  returnKeyType: 'done',
                }}
              />
            }
          />
          <Divider
            color={Colors.lightGray}
            containerStyle={[styles.divider, {marginTop: 20}]}
          />
          <Title style={styles.title}>{t('address_information_title')}</Title>
          <ListItemEdit
            field={t('input_address_name_field')}
            valueComponent={
              <TextInput
                ref={addressNameComponent}
                onSubmitEditing={focusOn(postalCodeComponent)}
                value={addressName}
                placeholder={t('input_address_name_placeholder')}
                onChangeText={setAddressName}
                returnKeyType={'next'}
                style={styles.inputField}
              />
            }
          />
          <ListItemEdit
            field={t('input_city_field')}
            placeholder={t('input_city_placeholder')}
            icon
            value={city}
            onPress={() => showBottomSheet('city', 1)}
          />
          <ListItemEdit
            field={t('input_postal_code_field')}
            valueComponent={
              <TextInput
                ref={postalCodeComponent}
                onSubmitEditing={focusOn(addressComponent)}
                value={postalCode}
                placeholder={t('input_postal_code_placeholder')}
                keyboardType="number-pad"
                onChangeText={setPostalCode}
                returnKeyType={'next'}
                style={styles.inputField}
              />
            }
          />
          <ListItemEdit
            field={t('input_address_field')}
            valueComponent={
              <TextInput
                ref={postalCodeComponent}
                value={address}
                placeholder={t('input_address_placeholder')}
                onChangeText={setAddress}
                returnKeyType={'done'}
                style={styles.inputField}
                multiline={true}
              />
            }
          />
          <ListItemEdit
            field={t('pin_location_field')}
            placeholder={t('pin_location_placeholder')}
            borderBottom
            icon
            onPress={() => navigateTo('Address')}
          />
          <Divider
            color={Colors.lightGray}
            containerStyle={[styles.divider, {marginTop: 20}]}
          />
        </View>
        {/* <BottomSheet
          style={styles.bottomSheet}
          ref={cityComponent}
          snapPoints={snapPointsCity}
          index={0}>
          <BottomSheetView><SelectCity /></BottomSheetView>
        </BottomSheet> */}
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  bottomSheet: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  title: {
    fontSize: 18,
    marginTop: 20,
  },
  editForm: {
    paddingHorizontal: 20,
    flex: 1,
    height: '100%',
  },
  inputField: {
    width: '100%',
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 10,
    // backgroundColor: 'red',
  },

  textInputStyle: {
    // phone number text area only
    color: Colors.primaryColor,
  },
  textContainerStyle: {
    // container containing phone and extension text
    backgroundColor: Colors.onPrimaryColor,
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 0,
    paddingLeft: 0,
  },
  containerStyle: {
    width: '100%',
  },
  codeTextStyle: {
    // phone ext text area
    color: Colors.primaryColor,
  },
  flagButtonStyle: {
    // flag style
    marginRight: 0,
  },
  countryPickerButtonStyle: {
    // flag container area
    backgroundColor: Colors.onPrimaryColor,
    margin: 0,
    paddingLeft: 0,
  },

  divider: {paddingVertical: 10, marginHorizontal: -30},
});

export default memo(AddServiceOptions);
