import React, {memo, useMemo} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {currencyFormatter} from '../../utils/currency';
import StarRating from '../../components/starrating/StarRating';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import {t} from 'i18next';

export const PHOTO_SIZE = 80;

const ConnectionItem = ({style, connection, dataType}) => {
  const {photo, name, price, rating, ratings, id} = connection;

  const mergedStyle = useMemo(() => [styles.container, style], [style]);

  const navigation = useNavigation();

  const navigateTo = screen => () => {
    let page = '';
    if (dataType == 'marketplace') {
      page = 'Product details';
    }
    if (dataType == 'pet_services') {
      page = 'Pet service details';
    }
    if (dataType == 'pet_services') {
      page = 'Social Feed';
    }

    navigation.navigate(page, {
      id: id,
    });
  };

  return (
    <TouchableOpacity onPress={navigateTo()}>
      <View style={mergedStyle}>
        <Image style={styles.image} source={{uri: photo}} />
        <View style={styles.textSection}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>{currencyFormatter(price)}</Text>
          <View style={styles.ratingSection}>
            <StarRating rating={rating} />
            <Text style={styles.ratingText}>
              {ratings} {t('reviews')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: Layout.LARGE_PADDING,
    paddingVertical: Layout.SMALL_PADDING,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 1,
  },
  image: {
    height: PHOTO_SIZE,
    width: PHOTO_SIZE,
    borderRadius: 5,
  },
  textSection: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginLeft: Layout.MEDIUM_MARGIN,
  },
  ratingSection: {
    flexDirection: 'row',
  },
  ratingText: {
    marginLeft: Layout.SMALL_MARGIN,
    color: Colors.gray,
  },
  name: {
    fontSize: 15,
    fontWeight: '500',
    paddingBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.error,
    paddingBottom: 4,
  },
});

export default memo(ConnectionItem);
