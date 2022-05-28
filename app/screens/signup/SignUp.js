// import dependencies
import React, {Component} from 'react';
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
import {register} from '../../api/SignUp';

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
class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: 'marcio',
      usernameFocused: false,
      phone: '85311317659',
      phoneFocused: false,
      password: '1234567',
      passwordFocused: false,
      secureTextEntry: true,
    };
  }

  usernameChange = text => {
    this.setState({
      username: text,
    });
  };

  usernameFocus = () => {
    this.setState({
      usernameFocused: true,
      phoneFocused: false,
      passwordFocused: false,
    });
  };

  phoneChange = text => {
    this.setState({
      phone: text,
    });
  };

  phoneFocus = () => {
    this.setState({
      phoneFocused: true,
      usernameFocused: false,
      passwordFocused: false,
    });
  };

  passwordChange = text => {
    this.setState({
      password: text,
    });
  };

  passwordFocus = () => {
    this.setState({
      passwordFocused: true,
      usernameFocused: false,
      phoneFocused: false,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  createAccount = async () => {
    this.setState({
      isLoading: true,
    });
    Toast.hide();

    const {username, phone, password} = this.state;
    let errMessage = '';
    try {
      const response = await register(
        username,
        phone,
        this.phone.getCallingCode(),
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
        AsyncStorage.setItem('ACCESS_TOKEN', response.access_token);
        AsyncStorage.setItem('REFRESH_TOKEN', response.refresh_token);
        this.setState(
          {
            usernameFocused: false,
            phoneFocused: false,
            passwordFocused: false,
            rePasswordFocused: false,
          },
          this.navigateTo('HomeNavigator'),
        );
      }
    } catch (e) {
      console.log(e);
      errMessage = I18n.t('error_server');
    }

    this.setState({
      isLoading: false,
    });

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

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  render() {
    const {t} = this.props;

    const {
      isLoading,
      username,
      usernameFocused,
      phone,
      phoneFocused,
      password,
      passwordFocused,
      secureTextEntry,
    } = this.state;

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
                  this.phone = r;
                }}
                defaultValue={phone}
                placeholder={t('phone_placeholder')}
                defaultCode="ID"
                layout="first"
                keyboardType="phone-pad"
                inputFocused={phoneFocused}
                onChangeText={this.phoneChange}
                // onChangeFormattedText={this.phoneChange}
                containerStyle={styles.containerStyle}
                textContainerStyle={styles.textContainerStyle}
                textInputStyle={styles.textInputStyle}
                codeTextStyle={styles.codeTextStyle}
                flagButtonStyle={styles.flagButtonStyle}
                countryPickerButtonStyle={styles.countryPickerButtonStyle}
                autoFocus></PhoneInput>

              <UnderlineTextInput
                onRef={r => {
                  this.username = r;
                }}
                onChangeText={this.usernameChange}
                onFocus={this.usernameFocus}
                inputFocused={usernameFocused}
                onSubmitEditing={this.focusOn(this.password)}
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
                  this.password = r;
                }}
                onChangeText={this.passwordChange}
                onFocus={this.passwordFocus}
                inputFocused={passwordFocused}
                onSubmitEditing={this.createAccount}
                returnKeyType="done"
                placeholder={t('password_placeholder')}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={password.length > 0}
                toggleText={secureTextEntry ? t('show') : t('hide')}
                onTogglePress={this.onTogglePress}
              />

              {/* <UnderlinePasswordInput
                onRef={r => {
                  this.rePassword = r;
                }}
                onChangeText={this.rePasswordChange}
                onFocus={this.rePasswordFocus}
                inputFocused={rePasswordFocused}
                onSubmitEditing={this.createAccount}
                returnKeyType="done"
                placeholder={t('re_password_placeholder')}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={password.length > 0}
                toggleText={secureTextEntry ? 'Show' : 'Hide'}
                onTogglePress={this.onTogglePress}
              /> */}

              <View style={styles.buttonContainer}>
                <Button
                  color={Colors.primaryColor}
                  rounded
                  borderRadius
                  disabled={isLoading}
                  onPress={this.createAccount}
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
                  // onPress={this.showInputModal(true)}
                  onPress={this.navigateTo('SignIn')}
                  style={styles.signInText}>
                  {t('already_have_account')}
                  <Text style={[styles.footerText, styles.footerLink]}>
                    {t('sign_in')}
                  </Text>
                </Text>
              </View>
            </View>

            <TouchableWithoutFeedback
              onPress={this.navigateTo('TermsConditions')}>
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
  }
}

export default withTranslation()(SignUp);
// export default SignUp;
