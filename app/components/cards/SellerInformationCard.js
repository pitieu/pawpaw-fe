import React, {memo, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {withTranslation} from 'react-i18next';
import {
  Image,
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';

// components
import Avatar from '../../components/avatar/Avatar';
import Icon from '../../components/icon/Icon';
import {
  Title,
  Heading5,
  Heading6,
  Subtitle1,
} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

export const {width, height} = Dimensions.get('window');

const IOS = Platform.OS === 'ios';
const MESSAGE_ICON = IOS ? 'ios-chatbox-outline' : 'md-chatbox-outline';

const SellerInformationCard = ({t, avatar, name, location, chatId}) => {
  const navigation = useNavigation();

  const goToMessage = () => {
    navigation.navigate('Message', {id: chatId});
  };
  return (
    <View style={styles.sellerInformationContainer}>
      <Title style={styles.title}>{t('seller_information')}</Title>
      <View style={styles.sellerAvatar}>
        <Avatar imageUri={avatar} size={54} rounded />
        <View style={styles.sellerDetails}>
          <Heading6 style={styles.sellerName}>{name?.toUpperCase()}</Heading6>
          <Subtitle1 style={styles.sellerLocation}>{location}</Subtitle1>
        </View>
        <View>
          <TouchableOpacity onPress={goToMessage}>
            <Icon name={MESSAGE_ICON} size={30} color={Colors.primaryColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sellerInformationContainer: {
    paddingHorizontal: Layout.MEDIUM_PADDING,
    paddingVertical: Layout.MEDIUM_PADDING,
    borderTopColor: Colors.lightGray,
    borderBottomColor: Colors.lightGray,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  sellerAvatar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerDetails: {
    flex: 1,
    // alignSelf: 'flex-start',
  },
  sellerName: {},
  sellerLocation: {},
  title: {
    paddingBottom: Layout.SMALL_PADDING,
  },
});

export default memo(withTranslation()(SellerInformationCard));
