// import dependencies
import React, {memo, useEffect, useState} from 'react';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {t} from 'i18next';

// import components
import Avatar from '../../components/avatar/Avatar';
import Icon from '../../components/icon/Icon';
import {Subtitle1, Subtitle2} from '../../components/text/CustomText';
import TouchableItem from '../../components/TouchableItem';
import OutlinedButton from '../../components/buttons/OutlinedButton';

// api
import {getUser} from '../../store/actions/user';
import {auth, logout} from '../../api/Auth';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// EditProfile Config
// const isRTL = I18nManager.isRTL;
// const ARROW_ICON = IOS
//   ? 'ios-chevron-forward-outline'
//   : 'md-chevron-forward-outline';
const AVATAR_SIZE = 100;
const DIVIDER_MARGIN_LEFT = 60;
const IOS = Platform.OS === 'ios';
const SETTINGS_ICON = IOS ? 'ios-settings-outline' : 'md-settings-outline';
const EXIT_ICON = IOS ? 'ios-exit-outline' : 'md-exit-outline';
const HEART_ICON = IOS ? 'ios-heart-outline' : 'md-heart-outline';
const CLIPBOARD_ICON = IOS ? 'ios-receipt-outline' : 'md-receipt-outline';
const HELP_CENTER_ICON = IOS ? 'ios-call-outline' : 'md-call-outline';

// Settings Components
const Setting = ({icon, title, onPress, extraData}) => (
  <TouchableItem onPress={onPress}>
    <View>
      <View style={[styles.row, styles.setting]}>
        <View style={styles.leftSide}>
          {icon !== undefined && (
            <View style={styles.iconContainer}>
              <Icon name={icon} size={24} color={Colors.primaryText} />
            </View>
          )}
          <Subtitle1 style={styles.mediumText}>{title}</Subtitle1>
        </View>

        {/* <View style={isRTL && {transform: [{scaleX: -1}]}}>
          <Icon name={ARROW_ICON} size={16} color="rgba(0, 0, 0, 0.16)" />
        </View> */}
      </View>

      {extraData ? (
        <View style={styles.extraDataContainer}>{extraData}</View>
      ) : (
        <View />
      )}
    </View>
  </TouchableItem>
);

const Profile = props => {
  const {
    route,
    // from state
    user,
    account,
    getUser,
  } = props;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    async function fetchData() {
      auth(navigation);
      try {
        await getProfile();
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, [route]);

  const navigateTo = screen => {
    navigation.navigate(screen);
  };

  const getProfile = async () => {
    await getUser();

    setUsername(account.username);
    setAvatar(account.avatar);
    // todo: format phone number using util function
    setPhone(`+${user.phone_ext} ${user.phone}`);
    setEmail(user.email);
  };

  const doLogout = () => {
    Alert.alert(
      t('logout'),
      t('logout_confirm'),
      [
        {
          text: t('cancel'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('logout'),
          onPress: async () => {
            await logout();
            navigation.navigate('SignIn');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const edit = () => {
    navigateTo('EditProfile');
  };

  const manageStore = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.statusBarColor}
        barStyle="dark-content"
      />

      <ScrollView enableOnAndroid>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Avatar
              imageUri={avatar || require('../../assets/img/profile.jpg')}
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
        <View style={styles.buttonContainer}>
          <OutlinedButton
            iconName="person-outline"
            buttonStyle={styles.btnOutline}
            title={t('edit_profile')}
            onPress={edit}
            // titleColor={Colors.onPrimaryColor}
            // iconColor={Colors.onPrimaryColor}
          />
        </View>
        <View style={styles.buttonContainer}>
          <OutlinedButton
            iconMoonName="vet"
            buttonStyle={styles.btnOutline}
            title={t('manage_store')}
            onPress={manageStore}

            // titleColor={Colors.onPrimaryColor}
            // iconColor={Colors.onPrimaryColor}
          />
        </View>

        <View style={styles.listLinks}>
          <Setting
            onPress={() => navigateTo('Orders')}
            icon={SETTINGS_ICON}
            title="Account Settings & Privacy"
          />
          {/* <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} /> */}

          <Setting
            onPress={() => navigateTo('Orders')}
            icon={CLIPBOARD_ICON}
            title="Transaction List"
          />
          {/* <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} /> */}

          <Setting
            onPress={() => navigateTo('Orders')}
            icon={HEART_ICON}
            title="Wishlist"
          />
          {/* <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} /> */}

          <Setting
            onPress={() => navigateTo('Orders')}
            icon={HELP_CENTER_ICON}
            title="Help Center"
          />
          {/* <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} /> */}

          <Setting onPress={doLogout} icon={EXIT_ICON} title="Logout" />
          {/* <Divider type="inset" marginLeft={DIVIDER_MARGIN_LEFT} /> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// EditProfile Styles
const styles = StyleSheet.create({
  iconContainer: {
    paddingRight: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  extraDataContainer: {
    top: -8,
    marginLeft: DIVIDER_MARGIN_LEFT,
    paddingBottom: 8,
  },
  extraData: {
    textAlign: 'left',
  },
  mediumText: {
    fontWeight: '300',
    color: Colors.primaryText,
  },
  setting: {
    height: 52,
  },
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
  buttonContainer: {
    paddingHorizontal: Layout.LARGE_PADDING,
    paddingBottom: Layout.SMALL_MARGIN,
  },
  btnOutline: {
    // backgroundColor: Colors.primaryColor,
  },
  listLinks: {
    paddingTop: Layout.MEDIUM_PADDING,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getUser,
    },
    dispatch,
  );

const mapStateToProps = (state, ownProps) => ({
  user: state.user.user,
  account: state.user.account,
});

export default memo(connect(mapStateToProps, mapDispatchToProps)(Profile));
