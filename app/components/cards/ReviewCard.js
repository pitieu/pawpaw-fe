import React, {memo, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {withTranslation} from 'react-i18next';
import {Text, StyleSheet, View, Dimensions, Platform} from 'react-native';

// components
import {Title} from '../../components/text/CustomText';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

export const {width, height} = Dimensions.get('window');

const IOS = Platform.OS === 'ios';

const ReviewCard = ({t}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.productDetailSection}>
      <Title style={styles.title}>{t('reviews')}</Title>
      <Text style={styles.productTitle}>Reviews HERE</Text>
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

export default memo(withTranslation()(ReviewCard));
