import React, {memo} from 'react';
import {withTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';

// components
import {Title} from '../../components/text/CustomText';
import ViewMoreText from '../../components/text/ViewMoreText';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';

const ProductDetailCard = ({t, description}) => {
  return (
    <View style={styles.productDetailSection}>
      <Title style={styles.title}>{t('detail_product')}</Title>
      <ViewMoreText style={styles.productTitle} text={description} />
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
