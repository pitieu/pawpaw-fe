import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {withTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';

// components
import {Subtitle1, Subtitle2} from '../../components/text/CustomText';
import Avatar from '../../components/avatar/Avatar';
import OutlinedButton from '../../components/buttons/OutlinedButton';
import StarRating from '../../components/starrating/StarRating';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

// api
import {fetchUser, getUser} from '../../api/Account';

export const PHOTO_SIZE = 80;

const Header = ({
  style,
  username,
  description,
  avatar,
  posts = 0,
  followers = 0,
  followings = 0,
  t,
}) => {
  const navigation = useNavigation();

  const containerStyle = useMemo(() => [styles.container, style], []);
  const navigateTo = screen => {
    navigation.navigate(screen);
  };
  const edit = () => {
    console.log('editProfile');
    navigateTo('EditProfile');
  };
  return (
    <View style={containerStyle}>
      <View style={styles.firstSection}>
        <View style={styles.avatar}>
          <Avatar
            imageUri={avatar || require('../../assets/img/profile.jpg')}
            rounded
            size={PHOTO_SIZE}
          />
        </View>
        <View style={styles.accountStats}>
          <View style={styles.stat}>
            <Subtitle1>{posts}</Subtitle1>
            <Subtitle2>{t('posts')}</Subtitle2>
          </View>
          <View style={styles.stat}>
            <Subtitle1>{followers}</Subtitle1>
            <Subtitle2>{t('followers')}</Subtitle2>
          </View>
          <View style={styles.stat}>
            <Subtitle1>{followings}</Subtitle1>
            <Subtitle2>{t('followings')}</Subtitle2>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <Subtitle1 style={styles.username}>{username}</Subtitle1>
        {description && <Text>{description}</Text>}
      </View>

      <OutlinedButton
        iconName="person-outline"
        title={t('edit_profile')}
        onPress={edit}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  stat: {
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: Layout.SMALL_PADDING,
    paddingTop: Layout.SMALL_PADDING,
  },
  userInfoSection: {
    paddingVertical: 18,
  },
  firstSection: {
    flex: 1,
    flexDirection: 'row',
  },
  accountStats: {
    marginTop: 28,
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginTop: 40,
  },
  container: {
    flexDirection: 'column',
    padding: 24,
  },
  rating: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Layout.SMALL_PADDING,
  },
  ratingReviewText: {
    paddingLeft: Layout.SMALL_PADDING,
  },
});

export default memo(withTranslation()(Header));
