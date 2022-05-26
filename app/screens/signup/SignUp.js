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
import {withTranslation} from 'react-i18next';

// import components
import Button from '../../components/buttons/Button';
import UnderlinePasswordInput from '../../components/textinputs/UnderlinePasswordInput';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import SwitchText from '../../components/toggle/switchText';

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
      username: '',
      usernameFocused: false,
      phone: '',
      phoneFocused: false,
      password: '',
      passwordFocused: false,
      rePassword: '',
      rePasswordFocused: false,
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
      rePasswordFocused: false,
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
      rePasswordFocused: false,
    });
  };

  passwordChange = text => {
    this.setState({
      password: text,
    });
  };

  passwordFocus = () => {
    this.setState({
      rePasswordFocused: false,
      passwordFocused: true,
      usernameFocused: false,
      phoneFocused: false,
    });
  };

  rePasswordChange = text => {
    this.setState({
      rePassword: text,
    });
  };

  rePasswordFocus = () => {
    this.setState({
      rePasswordFocused: true,
      passwordFocused: false,
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

  createAccount = () => {
    // const { username, phone, password } = this.state;
    this.setState(
      {
        usernameFocused: false,
        phoneFocused: false,
        passwordFocused: false,
        rePasswordFocused: false,
      },
      this.navigateTo('HomeNavigator '),
    );
  };

  focusOn = nextFiled => () => {
    if (nextFiled) {
      nextFiled.focus();
    }
  };

  render() {
    const {t} = this.props;

    const {
      username,
      usernameFocused,
      phone,
      phoneFocused,
      password,
      passwordFocused,
      rePassword,
      rePasswordFocused,
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
                keyboardType="email-address"
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
                onSubmitEditing={this.focusOn(this.phone)}
                returnKeyType="done"
                placeholder={t('password_placeholder')}
                placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
                secureTextEntry={secureTextEntry}
                borderColor={INPUT_BORDER_COLOR}
                focusedBorderColor={INPUT_FOCUSED_BORDER_COLOR}
                toggleVisible={password.length > 0}
                toggleText={secureTextEntry ? 'Show' : 'Hide'}
                onTogglePress={this.onTogglePress}
              />

              <UnderlinePasswordInput
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
              />

              <View style={styles.buttonContainer}>
                <Button
                  color={Colors.primaryColor}
                  rounded
                  borderRadius
                  onPress={this.createAccount}
                  title={t('create_account').toUpperCase()}
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
