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

// import components
import I18n from '../../assets/i18n/i18n';
import Button from '../../components/buttons/Button';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import SwitchText from '../../components/toggle/switchText';

// api
import {register} from '../../api/Auth';

// import colors, layout
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// SignUp Config
const PLACEHOLDER_TEXT_COLOR = Colors.gray;
const INPUT_TEXT_COLOR = Colors.primaryColor;
const INPUT_BORDER_COLOR = Colors.primaryColor;
const INPUT_FOCUSED_BORDER_COLOR = Colors.primaryColor;

// SignUp Styles
const styles = StyleSheet.create({
  signIn: {paddingVertical: 23},
  signInText: {
    fontWeight: '300',
    fontSize: 13,
    color: Colors.primaryColor,
    textAlign: 'center',
  },
  lang: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: Layout.LARGE_PADDING,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.onPrimaryColor,
  },
  contentContainerStyle: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  form: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
  inputContainer: {marginBottom: 7},
  vSpacer: {
    height: 15,
  },
  buttonContainer: {
    paddingVertical: 23,
  },
  buttonsGroup: {
    paddingTop: 23,
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

// SignUp
const SignUp = props => {
  const [phoneComponent, setPhoneComponent] = useState();
  const [passwordComponent, setPasswordComponent] = useState();
  const [usernameComponent, setUsernameComponent] = useState();
  const [username, setUsername] = useState('marcio');
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [phone, setPhone] = useState('85311317659');
  const [phoneExt, setPhoneExt] = useState('62');
  const [phoneFocused, setPhoneFocused] = useState(true);
  const [password, setPassword] = useState('1234567');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [screen, setScreen] = useState();

  const navigation = useNavigation();

  const {t} = props;

  const usernameFocus = () => {
    setUsernameFocused(true);
    setPhoneFocused(false);
    setPasswordFocused(false);
  };

  const phoneFocus = () => {
    setUsernameFocused(false);
    setPhoneFocused(true);
    setPasswordFocused(false);
  };

  const passwordFocus = () => {
    setUsernameFocused(false);
    setPhoneFocused(false);
    setPasswordFocused(true);
  };

  const onTogglePress = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const navigateTo = screen => () => {
    navigation.navigate(screen);
  };

  const createAccount = async () => {
    setIsLoading(true);

    Toast.hide();

    let errMessage = '';
    try {
      const response = await register(
        username,
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
          if (response.error_field === 'username') {
            errMessage = I18n.t('error_username');
          }
        }
        if (response.error_code === 103) {
          errMessage = I18n.t('error_phone_exists');
        }
        if (response.error_code === 104) {
          errMessage = I18n.t('error_username_exists');
        }
      } else {
        // SUCCESS LOGIN
        AsyncStorage.setItem('@access_token', response.data.access_token);
        AsyncStorage.setItem('@refresh_token', response.data.refresh_token);
        setUsernameFocused(false);
        setPhoneFocused(false);
        setPasswordFocused(false);
        setScreen(navigateTo('HomeNavigator'));
      }
    } catch (e) {
      errMessage = I18n.t('error_server');
    }
    setIsLoading(false);

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

  const focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
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
              // onChangeFormattedText={setPhone}
              containerStyle={styles.containerStyle}
              textContainerStyle={styles.textContainerStyle}
              textInputStyle={styles.textInputStyle}
              codeTextStyle={styles.codeTextStyle}
              flagButtonStyle={styles.flagButtonStyle}
              countryPickerButtonStyle={styles.countryPickerButtonStyle}
              autoFocus></PhoneInput>

            <UnderlineTextInput
              onRef={r => {
                setUsernameComponent(r);
              }}
              onChangeText={setUsername}
              onFocus={usernameFocus}
              inputFocused={usernameFocused}
              onSubmitEditing={focusOn(passwordComponent)}
              returnKeyType="next"
              blurOnSubmit={false}
              keyboardType="default"
              placeholder={t('username_placeholder')}
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              inputTextColor={INPUT_TEXT_COLOR}
              borderColor={INPUT_BORDER_COLOR}
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              inputContainerStyle={styles.inputContainer}
            />

            <UnderlinePasswordInput
              onRef={r => {
                setPasswordComponent(r);
              }}
              onChangeText={setPassword}
              onFocus={passwordFocus}
              inputFocused={passwordFocused}
              onSubmitEditing={createAccount}
              returnKeyType="done"
              placeholder={t('password_placeholder')}
              placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
              secureTextEntry={secureTextEntry}
              borderColor={INPUT_BORDER_COLOR}
              focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
              toggleVisible={password.length > 0}
              toggleText={secureTextEntry ? t('show') : t('hide')}
              onTogglePress={onTogglePress}
            />

            <View style={styles.buttonContainer}>
              <Button
                color={Colors.primaryColor}
                rounded
                borderRadius
                disabled={isLoading}
                onPress={createAccount}
                title={
                  isLoading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    t('continue').toUpperCase()
                  )
                }
                titleColor={Colors.onPrimaryColor}
              />
            </View>

            <View style={styles.signIn}>
              <Text
                // onPress={setInputModalVisible(true)}
                onPress={navigateTo('SignIn')}
                style={styles.signInText}>
                {t('already_have_account')}
                <Text style={[styles.footerText, styles.footerLink]}>
                  {t('sign_in')}
                </Text>
              </Text>
            </View>
          </View>

          <TouchableWithoutFeedback onPress={navigateTo('TermsConditions')}>
            <View style={styles.footer}>
              <Text style={styles.footerText}>{t('tnc_sign_up')}</Text>
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
    </SafeAreaView>
  );
};

export default withTranslation()(SignUp);
