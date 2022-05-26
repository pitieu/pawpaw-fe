// import dependencies
import React, {Component} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import PhoneInput from 'react-native-phone-number-input';

import I18n from '../../assets/i18n/i18n';
import {withTranslation} from 'react-i18next';

import Button from '../../components/buttons/Button';
import InputModal from '../../components/modals/InputModal';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import SwitchText from '../../components/toggle/switchText';

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

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailFocused: false,
      password: '',
      passwordFocused: false,
      secureTextEntry: true,
      inputModalVisible: false,
    };
  }

  emailChange = text => {
    this.setState({
      email: text,
    });
  };

  emailFocus = () => {
    this.setState({
      emailFocused: true,
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
      emailFocused: false,
    });
  };

  onTogglePress = () => {
    const {secureTextEntry} = this.state;
    this.setState({
      secureTextEntry: !secureTextEntry,
    });
  };

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  showInputModal = value => () => {
    this.setState({
      inputModalVisible: value,
    });
  };

  navigateTo = screen => () => {
    const {navigation} = this.props;
    navigation.navigate(screen);
  };

  signIn = () => {
    this.setState(
      {
        emailFocused: false,
        passwordFocused: false,
      },
      this.navigateTo('HomeNavigator'),
    );
  };

  switchLanguage = () => {
    const {language} = this.state;

    this.setState({
      language: language == 'en' ? 'id' : 'en',
    });
    I18n.changeLanguage(language);
    // console.log(i18n.changeLanguage(language));
    // console.log(language);
  };

  render() {
    const {t} = this.props;
    const {
      email,
      emailFocused,
      password,
      passwordFocused,
      secureTextEntry,
      inputModalVisible,
      phone,
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
                ref={phone}
                defaultValue={phone}
                placeholder={t('phone_placeholder')}
                defaultCode="ID"
                layout="first"
                onChangeText={text => {
                  this.phone = text;
                }}
                onChangeFormattedText={text => {
                  this.phone = text;
                }}
                containerStyle={styles.containerStyle}
                textContainerStyle={styles.textContainerStyle}
                textInputStyle={styles.textInputStyle}
                codeTextStyle={styles.codeTextStyle}
                flagButtonStyle={styles.flagButtonStyle}
                countryPickerButtonStyle={styles.countryPickerButtonStyle}
                autoFocus></PhoneInput>

              <UnderlinePasswordInput
                onRef={r => {
                  this.password = r;
                }}
                onChangeText={this.passwordChange}
                onFocus={this.passwordFocus}
                inputFocused={passwordFocused}
                onSubmitEditing={this.signIn}
                returnKeyType="done"
                placeholder={t('password_placeholder')}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                inputTextColor={INPUT_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={password.length > 0}
                toggleText={secureTextEntry ? 'Show' : 'Hide'}
                onTogglePress={this.onTogglePress}
              />

              <View style={styles.forgotPassword}>
                <Text
                  // onPress={this.showInputModal(true)}
                  onPress={this.navigateTo('ForgotPassword')}
                  style={styles.forgotPasswordText}>
                  {t('forgot_password')}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  color={Colors.primaryColor}
                  rounded
                  borderRadius
                  onPress={this.navigateTo('HomeNavigator')}
                  title={t('sign_in').toUpperCase()}
                  titleColor={Colors.onPrimaryColor}
                />
              </View>
              <View style={styles.forgotPassword}>
                <Text
                  // onPress={this.showInputModal(true)}
                  onPress={this.navigateTo('SignUp')}
                  style={styles.forgotPasswordText}>
                  {t('new_user_register')}
                  <Text style={[styles.footerText, styles.footerLink]}>
                    {t('sign_up')}
                  </Text>
                </Text>
              </View>
            </View>
            <TouchableWithoutFeedback
              onPress={this.navigateTo('TermsConditions')}>
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
          onRequestClose={this.showInputModal(false)}
          buttonTitle={'Reset password'.toUpperCase()}
          onClosePress={this.showInputModal(false)}
          visible={inputModalVisible}
        /> */}
      </SafeAreaView>
    );
  }
}

// SignIn
export default withTranslation()(SignIn);
// export default SignIn;
