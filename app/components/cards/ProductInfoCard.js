import React, {memo, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {t} from 'i18next';

// components
import Icon from '../../components/icon/Icon';
import StarRating from '../../components/starrating/StarRating';

// configs
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import {currencyFormatter} from '../../utils/currency';
import {HEART_OUTLINE_ICON, HEART_ICON} from '../../constants/icons';

const ProductInfo = props => {
  const {service} = props;

  const [liked, setLiked] = useState(0);

  const changeLiked = () => {
    const val = !liked;
    setLiked(val);
  };
  return (
    <View style={styles.productSection}>
      {/* Pricing Section */}
      {/* <View style={styles.belowImageContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {currencyFormatter(service.products[0].price)}
          </Text>
          {service.products[0].discountPercent && (
            <View style={styles.priceDiscountContainer}>
              <View style={styles.priceDiscountPercentContainer}>
                <Text style={styles.priceDiscountPercent}>
                  {service.products[0].discountPercent}
                </Text>
              </View>
              <Text style={styles.priceDiscount}>
                {currencyFormatter(service.products[0].discount)}
              </Text>
            </View>
          )}
        </View>
      </View> */}
      <View style={{flexDirection: 'column'}}>
        <Text style={styles.title}>{service.name}</Text>
        {/* Rating */}
        <View style={styles.reviewStarContainer}>
          <StarRating rating={service.rating} starSize={22} />
          <Text style={styles.reviewCountText}>
            {service.reviews || 0} {t('reviews')}
          </Text>
          {service.sold && (
            <Text style={styles.soldCountText}>
              {service.sold} {t('sold')}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity onPress={changeLiked}>
        <Icon
          name={liked ? HEART_ICON : HEART_OUTLINE_ICON}
          size={30}
          color={liked ? Colors.focusColor : Colors.gray}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productSection: {
    paddingHorizontal: Layout.MEDIUM_PADDING,
    paddingVertical: Layout.MEDIUM_PADDING,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 5,
  },
  belowImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Layout.SMALL_PADDING,
  },
  priceContainer: {
    flexDirection: 'column',
  },
  price: {
    color: Colors.focusColor,
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceDiscountContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceDiscount: {
    color: Colors.primaryText,
    fontSize: 16,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  priceDiscountPercentContainer: {
    backgroundColor: Colors.focusColor,
    paddingHorizontal: 6,
    paddingVertical: 3,
    marginTop: 6,
    marginRight: 6,
    borderRadius: 5,
  },
  priceDiscountPercent: {
    color: Colors.onFocusColor,
    textAlign: 'center',
  },

  reviewStarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: Layout.SMALL_PADDING,
  },
  reviewCountText: {
    paddingHorizontal: Layout.SMALL_PADDING,
  },

  soldCountText: {
    color: Colors.gray,
  },
});

export default memo(ProductInfo);
