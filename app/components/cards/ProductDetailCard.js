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

const ProductDetailCard = ({t, description}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.productDetailSection}>
      <Title style={styles.title}>{t('detail_product')}</Title>
      <Text style={styles.productTitle}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  productDetailSection: {
    paddingHorizontal: Layout.MEDIUM_PADDING,
    paddingVertical: Layout.MEDIUM_PADDING,
    borderTopColor: Colors.lightGray,
    borderBottomColor: Colors.lightGray,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  title: {
    paddingBottom: Layout.SMALL_PADDING,
  },
});

export default memo(withTranslation()(ProductDetailCard));
