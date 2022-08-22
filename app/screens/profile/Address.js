// import dependencies
import React, {
  memo,
  useState,
  useRef,
  useMemo,
  useCallback,
  useEffect,
} from 'react';

import {SafeAreaView, StyleSheet, View, Text, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {t} from 'i18next';
import PhoneInput from 'react-native-phone-number-input';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/dist/Ionicons';

// import components
import NavigationBar from '../../components/NavigationBar';
import ListItemEdit from '../../components/list/listItemEdit';
import {Title} from '../../components/text/CustomText';
import Divider from '../../components/divider/Divider';
import SelectCity from './SelectCity';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const AddServiceOptions = props => {
  const {route} = props;
  const navigation = useNavigation();

  const snapPointsCity = useMemo(() => ['99.99%'], []);

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
  const [latitude, setLatitude] = useState(route?.params?.latitude || null);
  const [longitude, setLongitude] = useState(route?.params?.longitude || null);
  const [locationText, setLocationText] = useState(
    route?.params?.locationText || null,
  );

  useEffect(() => {
    if (route?.params?.city) {
      setCity(route?.params?.city);
    }
    if (route?.params?.longitude) {
      setLatitude(route?.params?.longitude);
    }
    if (route?.params?.latitude) {
      setLongitude(route?.params?.latitude);
    }
    if (
      route?.params?.locationText != null &&
      route?.params?.locationText != undefined
    ) {
      setLocationText(route?.params?.locationText);
    }
  }, [route, navigation]);

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const focusOn = nextFiled => () => {
    if (nextFiled?.current) {
      nextFiled.current.focus();
    }
  };

  const showBottomSheet = useCallback(type => {
    if (type === 'city') {
      cityComponent.current?.expand();
    }
  }, []);

  const closeBottomSheet = useCallback(type => {
    if (type === 'city') {
      cityComponent.current?.close();
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
      geolocation: {
        longitude: longitude,
        latitude: latitude,
      },
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
            inputStyle={[
              city
                ? {
                    color: Colors.primaryColor,
                  }
                : null,
            ]}
            field={t('input_city_field')}
            placeholder={t('input_city_placeholder')}
            icon
            value={city}
            onPress={() => showBottomSheet('city')}
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
                returnKeyType={'done'}
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
            borderBottom
            icon
            valueComponent={
              <View
                style={{
                  flexDirection: 'row',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name={'location'}
                  size={20}
                  color={
                    latitude && longitude ? Colors.focusColor : Colors.gray
                  }
                  style={{marginRight: 5}}
                />
                <Text
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    color: Colors.primaryColor,
                  }}>
                  {locationText?.length > 0
                    ? locationText
                    : locationText != null
                    ? 'Location already set'
                    : t('pin_location_placeholder')}
                </Text>
              </View>
            }
            onPress={() => {
              navigateTo('LongLatMap', {parentScreen: 'Address'});
            }}
          />
          <Divider
            color={Colors.lightGray}
            containerStyle={[styles.divider, {marginTop: 20}]}
          />
        </View>
      </KeyboardAwareScrollView>
      <BottomSheet
        ref={cityComponent}
        style={styles.bottomSheet}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        snapPoints={snapPointsCity}
        index={-1}>
        <BottomSheetView style={{flex: 1, paddingTop: 21}}>
          <SelectCity onClose={closeBottomSheet('city')} onSelect={setCity} />
        </BottomSheetView>
      </BottomSheet>
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
