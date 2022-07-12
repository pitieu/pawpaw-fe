// import dependencies
import React, {memo, useState, useRef, useMemo, useCallback} from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Dimensions,
  Alert,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {t} from 'i18next';
import {connect} from 'react-redux';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-toast-message';
import DatePicker from 'react-native-date-picker';
import PhoneInput from 'react-native-phone-number-input';
import moment from 'moment';
import 'moment/locale/id';
import 'moment/locale/en-gb';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import {getStatusBarHeight} from 'react-native-status-bar-height';

// import components
import Icon from '../../components/icon/Icon';
import {Title} from '../../components/text/CustomText';
import NavigationBar from '../../components/NavigationBar';
import ListItemEdit from '../../components/list/listItemEdit';
import Divider from '../../components/divider/Divider';
import FullScreenInput from '../../components/textinputs/FullScreenInput';

// import colors
import Colors from '../../theme/colors';

export const STATUS_BAR_HEIGHT = getStatusBarHeight();

export const SCREEN_HEIGHT = Math.round(Dimensions.get('window').height);

const EditProfile = props => {
  const {navigation, route, account, user} = props;

  const LOCALE = 'en-gb';
  const genderComponent = useRef(null);
  const addressComponent = useRef(null);
  const bioComponent = useRef(null);
  const emailComponent = useRef(null);
  const phoneComponent = useRef(null);
  const fullScreenInputComponent = useRef(null);
  const [name, setName] = useState(account.username || '');
  const [bio, setBio] = useState(account.description || '');
  const [email, setEmail] = useState(user.email || '');
  const [birthday, setBirthday] = useState(new Date());
  const [birthdayFormatted, setBirthdayFormatted] = useState(account.birthday);
  const [phone, setPhone] = useState(user.phone || '');
  const [phoneExt, setPhoneExt] = useState(user.phone_ext || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(user.gender || '');

  const [key, setKey] = useState(0);

  const snapPointsGender = useMemo(() => [1, 170], []);
  const snapPointsAddress = useMemo(() => [1, '100%'], []);
  const snapPointsBio = useMemo(() => [1, '100%'], []);

  const showBottomSheet = useCallback((type, index) => {
    if (type === 'gender') {
      genderComponent.current?.snapToIndex(index);
    }
    if (type === 'address') {
      addressComponent.current?.snapToIndex(index);
    }
    if (type === 'bio') {
      bioComponent.current?.snapToIndex(index);
    }
  }, []);

  const closeBottomSheet = useCallback(type => {
    if (type === 'gender') {
      genderComponent.current?.close();
    }
    if (type === 'address') {
      addressComponent.current?.close();
    }
    if (type === 'bio') {
      bioComponent.current?.close();
    }
  }, []);

  const goBack = () => {
    navigation.goBack();
  };
  const editPhoto = () => {};

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const focusOn = nextFiled => () => {
    console.log(nextFiled);
    if (nextFiled?.current) {
      nextFiled.current.focus();
    }
  };

  const save = () => {};

  const confirmDiscard = type => {
    Alert.alert(t('confirm_discard_changes'), t('discard_changes_alert'), [
      {text: t('cancel').toUpperCase(), onPress: () => {}, style: 'cancel'},
      {
        text: t('discard').toUpperCase(),
        onPress: () => {
          if (type === 'bio') {
            closeBottomSheet('bio');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <NavigationBar
          title={t('edit_profile_title')}
          onPressBack={goBack}
          onPressNext={save}
          buttonNextText={t('save').toUpperCase()}
          border
        />

        <KeyboardAwareScrollView enableOnAndroid>
          <View style={styles.editForm}>
            <Title style={styles.title}>{t('profile_information_title')}</Title>
            <ListItemEdit
              containerStyle={{alignItems: 'center'}}
              field={
                <Image
                  source={require('../../assets/img/profile.jpg')}
                  style={{
                    borderWidth: 1,
                    borderColor: Colors.gray,
                    width: 50,
                    height: 50,
                  }}
                />
              }
              value={' '}
              iconBtn={t('btn_edit_photo').toUpperCase()}
              onPress={editPhoto}
              border={false}
            />
            <ListItemEdit
              field={t('input_name_field')}
              valueComponent={
                <TextInput
                  onSubmitEditing={focusOn(bioComponent)}
                  value={name}
                  placeholder={t('input_name_placeholder')}
                  onChangeText={setName}
                  returnKeyType={'next'}
                  style={styles.inputField}
                />
              }
            />
            <ListItemEdit
              field={t('input_bio_field')}
              value={bio}
              numberOfLines={3}
              onPress={() => {
                fullScreenInputComponent?.current?.setText(bio);
                showBottomSheet('bio', 1);
              }}
              borderBottom
            />

            <Title style={styles.title}>{t('account_information_title')}</Title>
            <ListItemEdit
              disabledContent
              field={t('user_id_field')}
              value={account?._id}
              onPress={() => {
                Clipboard.setString(account?._id);
                Toast.show({
                  type: 'default',
                  text1: t('user_id_copied'),
                  autoHide: true,
                  visibilityTime: 3 * 1e3, //3 seconds
                  onPress: () => Toast.hide(),
                  position: 'bottom',
                });
              }}
              icon="copy-outline"
            />
            <ListItemEdit
              disabledContent
              field={t('username')}
              value={account?.username}
            />
            <ListItemEdit
              field={t('input_email_field')}
              iconBtn={
                user.email_verified ? null : t('verify_email').toUpperCase()
              }
              valueComponent={
                <TextInput
                  ref={emailComponent}
                  onSubmitEditing={focusOn(phoneComponent)}
                  value={email}
                  placeholder={t('input_email_placeholder')}
                  keyboardType="email-address"
                  onChangeText={setEmail}
                  returnKeyType={'next'}
                  style={styles.inputField}
                />
              }
            />
            <ListItemEdit
              field={'Phone'}
              value={`+${phoneExt} ${phone}`}
              valueComponent={
                <PhoneInput
                  defaultValue={phone}
                  placeholder={t('phone_placeholder')}
                  defaultCode="ID"
                  layout="first"
                  keyboardType="phone-pad"
                  onChangeText={_phone => {
                    setPhone(_phone);
                    setPhoneExt(phoneComponent.current.getCallingCode());
                  }}
                  // onChangeFormattedText={setPhone}
                  containerStyle={styles.containerStyle}
                  textContainerStyle={styles.textContainerStyle}
                  textInputStyle={styles.textInputStyle}
                  codeTextStyle={styles.codeTextStyle}
                  flagButtonStyle={styles.flagButtonStyle}
                  countryPickerButtonStyle={styles.countryPickerButtonStyle}
                  textInputProps={{
                    ref: phoneComponent,
                    onSubmitEditing: () => {},
                    returnKeyType: 'done',
                  }}
                />
              }
            />
            <ListItemEdit
              field={'Gender'}
              placeholder={'Select a gender'}
              onPress={() => showBottomSheet('gender', 1)}
              value={gender}
            />
            <ListItemEdit
              field={'Birthday'}
              onPress={() => setShowDatePicker(true)}
              valueComponent={
                <>
                  <Text
                    style={[
                      birthdayFormatted
                        ? styles.birthday
                        : styles.birthdayInactive,
                    ]}>
                    {birthdayFormatted || t('birthday_placeholder')}
                  </Text>
                  <DatePicker
                    style={{height: 50}}
                    modal
                    open={showDatePicker}
                    date={birthday}
                    maximumDate={
                      new Date(
                        new Date().getTime() - 60 * 60 * 24 * 365 * 17 * 1000, // deduct 17 years?
                      )
                    }
                    onConfirm={date => {
                      setShowDatePicker(false);
                      setBirthday(date);
                      setBirthdayFormatted(
                        // todo set locale accordingly
                        moment(date).locale(LOCALE).format('DD MMMM YYYY'),
                      );
                    }}
                    onCancel={() => {
                      setShowDatePicker(false);
                    }}
                    mode={'date'}
                    locale={LOCALE} // todo add locale
                  />
                </>
              }
            />
            <ListItemEdit
              field={t('address_field')}
              placeholder={t('address_field_placeholder')}
              borderBottom
              // onPress={}
            />
          </View>
        </KeyboardAwareScrollView>

        {/* GENDER COMPONENT */}
        <BottomSheet
          style={styles.bottomSheet}
          ref={genderComponent}
          snapPoints={snapPointsGender}
          index={0}>
          <BottomSheetView>
            <Button
              onPress={() => {
                setGender('male');
                closeBottomSheet('gender');
              }}
              title="Male"
            />
            <Button
              onPress={() => {
                setGender('female');
                closeBottomSheet('gender');
              }}
              title="Female"
            />
            <Button
              onPress={() => {
                setGender(null);
                closeBottomSheet('gender');
              }}
              title="None"
            />
          </BottomSheetView>
        </BottomSheet>

        {/* BIO COMPONENT */}
        <BottomSheet
          style={styles.bottomSheet}
          ref={bioComponent}
          snapPoints={snapPointsBio}
          enableContentPanningGesture={false}
          enableHandlePanningGesture={false}
          index={0}>
          <BottomSheetView style={{flex: 1, paddingTop: 21}}>
            <FullScreenInput
              ref={fullScreenInputComponent}
              title={'Biography'}
              value={bio}
              minLength={20}
              maxLength={200}
              onPressBack={() => {
                confirmDiscard('bio');
                // closeBottomSheet('bio');
              }}
              onSavePressed={_bio => {
                setBio(_bio);
                closeBottomSheet('bio');
              }}
            />
          </BottomSheetView>
        </BottomSheet>

        {/* ADDRESS COMPONENT */}
        <BottomSheet
          style={styles.bottomSheet}
          ref={addressComponent}
          snapPoints={snapPointsAddress}
          index={0}>
          <BottomSheetView>
            <FullScreenInput title={'Address'} />
          </BottomSheetView>
        </BottomSheet>
      </SafeAreaView>
    </>
  );
};

// EditProfile Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  birthday: {
    paddingVertical: 10,
  },
  birthdayInactive: {
    color: Colors.gray,
    paddingVertical: 10,
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
});

const mapStateToProps = (state, ownProps) => ({
  user: state.user.user,
  account: state.user.account,
});

export default memo(connect(mapStateToProps, null)(EditProfile));
