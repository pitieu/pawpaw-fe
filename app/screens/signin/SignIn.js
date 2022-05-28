// import dependencies
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';
import {withTranslation} from 'react-i18next';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

// config
import config from '../../config';

// components
import I18n from '../../assets/i18n/i18n';
import Button from '../../components/buttons/Button';
import InputModal from '../../components/modals/InputModal';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import SwitchText from '../../components/toggle/switchText';

// api
import {login} from '../../api/Auth';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// SignIn Config
const PLACEHOLDER_TEXT_COLOR = Colors.gray;
const INPUT_TEXT_COLOR = Colors.primaryColor;
const INPUT_BORDER_COLOR = Colors.primaryColor;
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

// SignIn Styles
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.onPrimaryColor,
  },
  contentContainerStyle: {flex: 1},
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  lang: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: Layout.LARGE_PADDING,
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  buttonContainer: {paddingTop: 23},
  forgotPassword: {paddingVertical: 23},
  forgotPasswordText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.primaryColor,
    textAlign: 'center',
  },
  separator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 64,
    height: 1,
    backgroundColor: INPUT_BORDER_COLOR,
  },
  orText: {
    top: -2,
    paddingHorizontal: 8,
    color: PLACEHOLDER_TEXT_COLOR,
  },
  buttonsGroup: {
    paddingTop: 23,
  },
  vSpacer: {
    height: 15,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  termsContainer: {
    flexDirection: 'row',
  },
  footerText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.primaryColor,
  },
  footerLink: {
    fontWeight: '400',
    textDecorationLine: 'underline',
  },
  textInputStyle: {
    // phone number text area only
    color: Colors.primaryColor,
  },
  textContainerStyle: {
    // container containing phone and extension text
    backgroundColor: Colors.onPrimaryColor,
    borderBottomColor: Colors.primaryColor,
    borderBottomWidth: 1,
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
  },
  countryPickerButtonStyle: {
    // flag container area
    backgroundColor: Colors.onPrimaryColor,
  },
});

const SignIn = props => {
  const [phoneComponent, setPhoneComponent] = useState();
  const [passwordComponent, setPasswordComponent] = useState();
  const [phone, setPhone] = useState('85311317659');
  const [phoneExt, setPhoneExt] = useState('62');
  const [phoneFocused, setPhoneFocused] = useState(true);
  const [password, setPassword] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [inputModalVisible, setInputModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [screen, setScreen] = useState();

  const navigation = useNavigation();

  const {t} = props;

  const passwordFocus = () => {
    setPhoneFocused(false);
    setPasswordFocused(true);
  };

  const onTogglePress = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const navigateTo = screen => () => {
    navigation.navigate(screen);
  };

  const signIn = async () => {
    setIsLoading(true);

    Toast.hide();

    let errMessage = '';
    if (!password || password.length < 6) {
      errMessage = I18n.t('error_password');
    }
    if (!phone || phone.length < 6) {
      errMessage = I18n.t('error_phone');
    }
    try {
      if (phone && password) {
        const response = await login(
          phone,
          phoneComponent.getCallingCode(),
          password,
        );

        if (response.status != 200) {
          // FAIL LOGIN
          if (response.error_code === 100) {
            if (response.error_field === 'phone') {
              errMessage = I18n.t('error_phone');
            }
            if (response.error_field === 'phone_ext') {
              errMessage = I18n.t('error_phone_ext');
            }
            if (response.error_field === 'password') {
              errMessage = I18n.t('error_password');
            }
          }
          if (response.error_code === 101) {
            errMessage = I18n.t('error_phone_not_found');
          }
          if (response.error_code === 102) {
            errMessage = I18n.t('error_password_not_match');
          }
        } else {
          console.log(response.data);
          // SUCCESS LOGIN
          AsyncStorage.setItem('@access_token', response.data.access_token);
          AsyncStorage.setItem('@refresh_token', response.data.refresh_token);
          setPasswordFocused(false);
          setPhoneFocused(false);
          setScreen(navigateTo('HomeNavigator'));
        }
      }
      setIsLoading(false);
    } catch (e) {
      errMessage = I18n.t('error_server');
      setIsLoading(false);
    }
    if (errMessage.length) {
      Toast.show({
        type: 'error',
        text1: errMessage,
        autoHide: true,
        visibilityTime: 10 * 1e3, //10 seconds
        onPress: () => Toast.hide(),
      });
    }
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <StatusBar
        backgroundColor={Colors.statusBarColor}
        barStyle="dark-content"
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.contentContainerStyle}>
        <View style={styles.content}>
          <View style={styles.lang}>
            <SwitchText />
          </View>
          <View style={styles.form}>
            <PhoneInput
              ref={r => {
                setPhoneComponent(r);
              }}
              defaultValue={phone}
              placeholder={t('phone_placeholder')}
              defaultCode="ID"
              layout="first"
              keyboardType="phone-pad"
              inputFocused={phoneFocused}
              onChangeText={setPhone}
              // onChangeFormattedText={this.phoneChange}
              containerStyle={styles.containerStyle}
              textContainerStyle={styles.textContainerStyle}
              textInputStyle={styles.textInputStyle}
              codeTextStyle={styles.codeTextStyle}
              flagButtonStyle={styles.flagButtonStyle}
              countryPickerButtonStyle={styles.countryPickerButtonStyle}
              autoFocus></PhoneInput>

            <UnderlinePasswordInput
              onRef={r => {
                setPasswordComponent(r);
              }}
              onChangeText={setPassword}
              onFocus={passwordFocus}
              inputFocused={passwordFocused}
              onSubmitEditing={signIn}
              returnKeyType="done"
              placeholder={t('password_placeholder')}
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              inputTextColor={INPUT_TEXT_COLOR}
              secureTextEntry={secureTextEntry}
              borderColor={INPUT_BORDER_COLOR}
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              toggleVisible={password.length > 0}
              toggleText={secureTextEntry ? t('show') : t('hide')}
              onTogglePress={onTogglePress}
            />

            <View style={styles.forgotPassword}>
              <Text
                // onPress={setInputModalVisible(true)}
                onPress={navigateTo('ForgotPassword')}
                style={styles.forgotPasswordText}>
                {t('forgot_password')}
              </Text>
            </View>
            <View style={styles.buttonContainer}>
              <Button
                color={Colors.primaryColor}
                rounded
                borderRadius
                disabled={isLoading}
                onPress={signIn}
                title={
                  isLoading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    t('sign_in').toUpperCase()
                  )
                }
                titleColor={Colors.onPrimaryColor}
              />
            </View>
            <View style={styles.forgotPassword}>
              <Text
                // onPress={setInputModalVisible(true)}
                onPress={navigateTo('SignUp')}
                style={styles.forgotPasswordText}>
                {t('new_user_register')}
                <Text style={[styles.footerText, styles.footerLink]}>
                  {t('sign_up')}
                  {/* {isLoading && (
                      <ActivityIndicator size="large" color="yellow" />
                    )} */}
                </Text>
              </Text>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={navigateTo('TermsConditions')}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('tnc_sign_in')}</Text>
              <View style={styles.termsContainer}>
                <Text style={[styles.footerText, styles.footerLink]}>
                  {t('tnc')}
                </Text>
                <Text style={styles.footerText}> {t('and')} </Text>
                <Text style={[styles.footerText, styles.footerLink]}>
                  {t('privacy_policy')}
                </Text>
                <Text style={styles.footerText}>.</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAwareScrollView>

      {/* <InputModal
          title={t('forgot_password')}
          message="Enter your phone number to reset password"
          inputDefaultValue={email}
          inputPlaceholder={t('phone_placeholder')}
          inputKeyboardType="email-address"
          onRequestClose={setInputModalVisible(false)}
          buttonTitle={'Reset password'.toUpperCase()}
          onClosePress={setInputModalVisible(false)}
          visible={inputModalVisible}
        /> */}
    </SafeAreaView>
  );
};

// SignIn
export default withTranslation()(SignIn);
// export default SignIn;
