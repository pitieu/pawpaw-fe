/**
 * Foodvila - React Native Template
 *
 * @format
 * @flow
 */

// import dependencies
import React, {Component} from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {withTranslation} from 'react-i18next';

// import components
import Avatar from '../../components/avatar/Avatar';
import Icon from '../../components/icon/Icon';
import {
  Subtitle1,
  Subtitle2,
  Subtitle3,
} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';
import UnderlineTextInput from '../../components/textinputs/UnderlineTextInput';
import OutlinedButton from '../../components/buttons/OutlinedButton';
import Button from '../../components/buttons/Button';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// EditProfile Config
const AVATAR_SIZE = 100;
const IOS = Platform.OS === 'ios';

// EditProfile Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  avatarSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingLeft: Layout.LARGE_PADDING,
  },
  userInfo: {
    flex: 1,
    padding: Layout.LARGE_PADDING,
    paddingTop: Layout.SMALL_PADDING,
  },
  avatar: {},
  whiteCircle: {
    marginTop: -18,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  cameraButtonContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primaryColor,
    overflow: 'hidden',
  },
  cameraButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 34,
    height: 34,
  },

  username: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttons: {
    paddingHorizontal: Layout.LARGE_PADDING,
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'Ari Cho',
      email: 'john.doe@example.com',
      phone: '+1 23 4567890',
    };
  }

  goBack = () => {
    const {navigation} = this.props;
    navigation.goBack();
  };

  render() {
    const {t} = this.props;

    const {username, email, phone} = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          backgroundColor={Colors.statusBarColor}
          barStyle="dark-content"
        />

        <KeyboardAwareScrollView enableOnAndroid>
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Avatar
                imageUri={require('../../assets/img/profile.jpg')}
                rounded
                size={AVATAR_SIZE}
              />
            </View>
            <View style={styles.userInfo}>
              <Subtitle1 style={styles.username}>{username}</Subtitle1>
              <Subtitle1>{phone}</Subtitle1>
              <Subtitle1>{email}</Subtitle1>
            </View>
          </View>
          <View style={styles.buttons}>
            {/* <Button small rounded outlined /> */}
            <OutlinedButton
              iconMoonName="vet"
              style={styles.btnOutline}
              title={t('manage_store')}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

export default withTranslation()(Profile);
