// import dependencies
import React, {useState, useRef, memo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Toast from 'react-native-toast-message';
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

// import components
import I18n from '../../assets/i18n/i18n';
import Button from '../../components/buttons/Button';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import SwitchText from '../../components/toggle/switchText';

// api
import {register, login} from '../../store/actions/auth';
import {toast} from '../../store/actions/toast';

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
  const {t} = props;

  const phoneComponent = useRef(null);
  // const usernameComponent = useRef(null);

  const [usernameComponent, setUsernameComponent] = useState();
  const [passwordComponent, setPasswordComponent] = useState();
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
    if (!phone || phone.length < 6) {
      props.toast(I18n.t('error_phone'));
    } else if (!username || username.length < 6) {
      props.toast(I18n.t('error_username'));
    } else if (!password || password.length < 6) {
      props.toast(I18n.t('error_password'));
    } else {
      props
        .register(
          username,
          phone,
          phoneComponent.current.getCallingCode(),
          password,
        )
        .then(() => {
          console.log('register');
          props
            .login(phone, phoneComponent.current.getCallingCode(), password)
            .then(() => {
              setIsLoading(false);
              setScreen(navigateTo('HomeNavigator'));
            })
            .catch(() => {
              setScreen(
                navigateTo('SignIn', {
                  username,
                  phone,
                  phoneExt: phoneComponent.current.getCallingCode(),
                  password,
                }),
              );
            });
          setUsernameFocused(false);
          setPhoneFocused(false);
          setPasswordFocused(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }
  };

  const focusOn = nextField => () => {
    console.log(nextField);
    if (nextField) {
      nextField.focus();
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
              ref={phoneComponent}
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
              value={username}
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
              value={password}
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
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      login,
      register,
      toast,
    },
    dispatch,
  );

export default memo(
  connect(null, mapDispatchToProps)(withTranslation()(SignUp)),
);
