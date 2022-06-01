import React, {memo, useState, useRef, Fragment} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {withTranslation} from 'react-i18next';
import Carousel, {Pagination} from 'react-native-snap-carousel';

// components
import Icon from '../../components/icon/Icon';
import StarRating from '../../components/starrating/StarRating';
import Button from '../../components/buttons/Button';
import OutlinedButton from '../../components/buttons/OutlinedButton';
import Avatar from '../../components/avatar/Avatar';
import SellerInformationCard from '../../components/cards/SellerInformationCard';
import ProductDetailCard from '../../components/cards/ProductDetailCard';

// utils
import {currencyFormatter} from '../../utils/currency';

// import colors
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import {Heading6, Title} from '../../components/text/CustomText';
import ReviewCard from '../../components/cards/ReviewCard';

const IOS = Platform.OS === 'ios';
const HEART_OUTLINE_ICON = IOS ? 'ios-heart-outline' : 'md-heart-outline';
const HEART_ICON = IOS ? 'ios-heart' : 'md-heart';
const MESSAGE_ICON = IOS ? 'ios-chatbox-outline' : 'md-chatbox-outline';
const CART_ICON = IOS ? 'ios-cart-outline' : 'md-cart-outline';

var {width, height} = Dimensions.get('window');

const data = {
  chatId: 1,
  location: 'Jakarta Pusat',
  price: 120000,
  discount: 240000,
  discountPercent: '50%',
  rating: 3.6,
  reviews: 11,
  sold: 25,
  name: 'Cho Store', //seller name
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  title: 'Dove Shampoo Perawatan Rambut Rontok - 1400ml - Free Hair Massager',
  description: 'Description here',
  reviewsList: [
    {
      reviewer_name: 'Edgar Carinos',
      rating: 4,
      review:
        "A healthy puppy's body temperature ranges from 38.5 to 39.5 degrees, and is slightly higher in the afternoon. The temperature difference between day and night is generally less than 1 degree...",
      photos: [
        'https://randomuser.me/api/portraits/men/5.jpg',
        'https://randomuser.me/api/portraits/men/6.jpg',
        'https://randomuser.me/api/portraits/men/7.jpg',
      ],
    },
  ],
};

const images = [
  {
    title: 'Item 1',
    text: 'Text 1',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    title: 'Item 2',
    text: 'Text 2',
    photo: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    title: 'Item 3',
    text: 'Text 3',
    photo: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    title: 'Item 4',
    text: 'Text 4',
    photo: 'https://randomuser.me/api/portraits/men/4.jpg',
  },
  {
    title: 'Item 5',
    text: 'Text 5',
    photo: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
];

const ProductDetails = ({route, t}) => {
  // TODO Add View more in Description
  //   const {id} = route.params;
  const id = 2;
  const carouselRef = useRef(null);

  const [activeSlide, setActiveSlide] = useState(0);
  const [liked, setLiked] = useState(0);

  console.log('id', id);

  _renderItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={{uri: item.photo}}
          defaultSource="https://randomuser.me/api/portraits/men/5.jpg"
        />
      </View>
    );
  };

  const pagination = () => {
    return (
      <Pagination
        dotsLength={images.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.paginationDotInactive}
        inactiveDotOpacity={1}
        inactiveDotScale={1}
      />
    );
  };

  const changeLiked = () => {
    const val = !liked;
    setLiked(val);
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.topArea} />
      <View style={styles.screenContainer}>
        <ScrollView>
          <Carousel
            ref={carouselRef}
            data={images}
            renderItem={this._renderItem}
            sliderWidth={width}
            itemWidth={width}
            onSnapToItem={setActiveSlide}
          />
          {pagination()}
          <View style={styles.productSection}>
            {/* Pricing Section */}
            <View style={styles.belowImageContainer}>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>
                  {currencyFormatter(data.price)}
                </Text>

                <View style={styles.priceDiscountContainer}>
                  <View style={styles.priceDiscountPercentContainer}>
                    <Text style={styles.priceDiscountPercent}>
                      {data.discountPercent}
                    </Text>
                  </View>
                  <Text style={styles.priceDiscount}>
                    {currencyFormatter(data.discount)}
                  </Text>
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
            <Text style={styles.title}>{data.title}</Text>
            {/* Rating */}
            <View style={styles.reviewStarContainer}>
              <StarRating rating={data.rating} starSize={22} />
              <Text style={styles.reviewCountText}>
                {data.reviews} {t('reviews')}
              </Text>
              <Text style={styles.soldCountText}>
                {data.sold} {t('sold')}
              </Text>
            </View>
          </View>
          <ProductDetailCard title={data.description} />

          {/* Seller Information */}
          <SellerInformationCard
            avatar={data.avatar}
            name={data.name}
            location={data.location}
            chatId={data.chatId}
          />
          {/* Review Section */}
          <ReviewCard reviews={data.reviewsList} />
        </ScrollView>

        <View style={styles.bottomButtonsContainer}>
          <OutlinedButton
            color={Colors.primaryColor}
            titleColor={Colors.white}
            iconName={MESSAGE_ICON}
            iconColor={Colors.primaryColor}
            buttonStyle={styles.outlinedButton}
          />
          <View style={styles.shopBtnContainer}>
            <OutlinedButton
              color={Colors.primaryColor}
              title={t('buy_now')}
              buttonStyle={[
                styles.outlinedButton,
                {marginHorizontal: Layout.SMALL_MARGIN, flex: 1},
              ]}
            />
            <OutlinedButton
              titleColor={Colors.onPrimaryColor}
              title={t('add_cart')}
              buttonStyle={[styles.filledButton, {flex: 1}]}
            />
          </View>
        </View>
      </View>
    </Fragment>
  );
};
const styles = StyleSheet.create({
  paginationContainer: {
    top: 240,
    width: '100%',
    position: 'absolute',
    // backgroundColor: Colors.onPrimaryColor,
  },
  productSection: {
    paddingHorizontal: Layout.MEDIUM_PADDING,
    paddingVertical: Layout.MEDIUM_PADDING,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: 2,
  },
  paginationDotInactive: {
    backgroundColor: Colors.gray,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    marginHorizontal: -5,
    marginTop: 0,
    backgroundColor: Colors.accentColor,
  },
  image: {
    height: 300,
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
    color: Colors.primaryText,
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
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: 16,
    paddingBottom: 28,
    // backgroundColor: '#fff',
    borderTopColor: Colors.lightGray,
    borderTopWidth: 1,
  },
  outlinedButton: {
    borderColor: Colors.primaryColor,
    borderWidth: 1,
    color: Colors.primaryColor,
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  filledButton: {
    backgroundColor: Colors.primaryColor,
  },
  shopBtnContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  screenContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    paddingBottom: Layout.SMALL_PADDING,
  },
  reviewSection: {
    paddingHorizontal: Layout.MEDIUM_PADDING,
    paddingVertical: Layout.MEDIUM_PADDING,
    borderTopColor: Colors.lightGray,
    borderBottomColor: Colors.lightGray,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
});

export default memo(withTranslation()(ProductDetails));
