import React, {memo} from 'react';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';

// components
import {Subtitle1, Title} from '../../components/text/CustomText';
import ViewMoreText from '../../components/text/ViewMoreText';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const ProductDetailCard = ({t, description}) => {
  return (
    <View style={styles.productDetailSection}>
      <Title style={styles.title}>{t('detail_product')}</Title>
      <Subtitle1 style={styles.subtitle}>{t('description_subtitle')}</Subtitle1>
      <ViewMoreText style={styles.productTitle} text={description || ' '} />
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
  subtitle: {
    fontWeight: '500',
  },
});

export default memo(withTranslation()(ProductDetailCard));
