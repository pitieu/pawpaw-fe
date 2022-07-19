import React, {memo, useState, useRef, Fragment, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  SafeAreaView,
  Image,
  Text,
} from 'react-native';
// import Carousel, {Pagination} from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {t} from 'i18next';
import {Skeleton} from '@rneui/themed';
import Icon from 'react-native-vector-icons/Ionicons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// components
import OutlinedButton from '../../components/buttons/OutlinedButton';
import SellerInformationCard from '../../components/cards/SellerInformationCard';
import ProductDetailCard from '../../components/cards/ProductDetailCard';
import ProductListCard from '../../components/cards/ProductListCard';
import ProductInfoCard from '../../components/cards/ProductInfoCard';
import ReviewCard from '../../components/cards/ReviewCard';
import TouchableItem from '../../components/TouchableItem';
import NavigationBar from '../../components/NavigationBar';

// api
import {fetchService} from '../../store/actions/service';

// import configs
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import config from '../../config';
import {MESSAGE_ICON, CART_OUTLINE_ICON} from '../../constants/icons';
import {SCREEN_WIDTH} from '../../constants';
import {currencyFormatter} from '../../utils/currency';

const ProductDetails = props => {
  const {route, navigation} = props;
  // Todo fix seller information should come from user or store

  const carouselRef = useRef(null);
  const [service, setService] = useState(route.params.service);
  const [productCount, setProductCount] = useState(0);
  const [addonCount, setAddonCount] = useState(0);

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedProductsTotal, setSelectedProductsTotal] = useState(0);
  const [productTotal, setProductTotal] = useState(0);
  const [addonTotal, setAddonTotal] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(productTotal + addonTotal);
  }, [productTotal, addonTotal]);

  const [activeSlide, setActiveSlide] = useState(0);

  const navigateTo = (screen, options) => {
    navigation.navigate(screen, options);
  };

  const getSum = productsTotal => {
    const prodValues = Object.values(productsTotal);
    const countProducts = prodValues
      .map(prod => prod.count)
      .reduce((prev, next) => prev + next, 0);
    const totalSum = prodValues
      .map(prod => prod.count * prod.product.price)
      .reduce((prev, next) => prev + next, 0);
    return {total: totalSum, count: countProducts};
  };

  const productsChange = productsTotal => {
    const sum = getSum(productsTotal);

    setProductCount(sum.count);
    setProductTotal(sum.total);
  };

  const addonsChange = productsTotal => {
    const sum = getSum(productsTotal);

    setAddonCount(sum.count);
    setAddonTotal(sum.total);
  };

  const _renderCarouselItem = ({item, index}) => {
    return (
      <View style={styles.slide}>
        <Image
          style={styles.image}
          source={{
            uri: config.api_address + 'services/images/' + item.filename,
          }}
        />
      </View>
    );
  };

  const shop = () => {
    console.log('shop');
  };

  const edit = () => {
    navigateTo('ServiceStackNavigator', {
      screen: 'AddPetService',
      params: {
        id: service._id,
        photos: service.photos.map((photo, index) => {
          return {
            uri: config.api_address + 'services/images/' + photo.filename,
            width: 99,
            height: 213,
            fileSize: new Date().getTime() + index + 1,
            fileName: photo.filename,
            type: photo.content_type,
            id: photo._id,
          };
        }),
        name: service.name,
        price: service.price,
        description: service.description,
        services: service.products,
        addons: service.product_addons,
        deliveryLocationStore: service.delivery.delivery_location_store,
        deliveryLocationHome: service.delivery.delivery_location_home,
        deliveryFee: service.delivery.price_per_km,
      },
    });
  };

  return (
    <Fragment>
      <SafeAreaView style={styles.topArea} />
      <NavigationBar
        title={service?.name || ' '}
        buttonNextText={'Edit'}
        onPressNext={edit}
      />
      {!service && (
        <>
          <Skeleton animation="wave" circle width={40} height={40} />
          <Skeleton animation="wave" width={120} height={40} />
        </>
      )}
      {service && (
        <View style={styles.screenContainer}>
          <KeyboardAwareScrollView
          // contentContainerStyle={{flex: 1, width: '100%'}}
          >
            {/* <Carousel
              ref={carouselRef}
              data={service.photos}
              renderItem={_renderCarouselItem}
              sliderWidth={SCREEN_WIDTH}
              itemWidth={SCREEN_WIDTH}
              onSnapToItem={setActiveSlide}
            />
            <Pagination
              dotsLength={service.photos.length}
              activeDotIndex={activeSlide}
              containerStyle={styles.paginationContainer}
              dotStyle={styles.paginationDot}
              inactiveDotStyle={styles.paginationDotInactive}
              inactiveDotOpacity={1}
              inactiveDotScale={1}
            /> */}
            {/* <ProductInfoCard service={service} /> */}
            <ProductListCard
              title={'Service Options'}
              products={service.products}
              onProductsChange={productsChange}
            />

            {service?.product_addons?.length > 0 && (
              <ProductListCard
                title={'Extras'}
                products={service?.product_addons}
                onProductsChange={addonsChange}
              />
            )}
            {service?.description?.length > 0 && (
              <ProductDetailCard description={service?.description} />
            )}
            {/* Seller Information */}
            <SellerInformationCard
              avatar={service.store_id.avatar}
              name={service.store_id.name}
              location={service.store_id.location}
              chatId={service.store_id.chatId}
            />
            {/* Review Section */}
            {/* <ReviewCard reviews={service.reviewsList} /> */}
          </KeyboardAwareScrollView>
          {total == 0 && <View style={styles.bottomButtonsContainer}></View>}
          {total > 0 && (
            <View style={styles.bottomButtonsContainer}>
              <OutlinedButton
                color={Colors.primaryColor}
                titleColor={Colors.white}
                iconName={MESSAGE_ICON}
                iconColor={Colors.primaryColor}
                buttonStyle={styles.outlinedButton}
              />
              <TouchableItem
                style={[styles.filledButton, styles.btnShopTouchable]}
                onPress={shop}>
                <View style={styles.btnShopContainer}>
                  <View style={styles.btnShopTextContainer}>
                    {total > 0 && (
                      <Text style={styles.btnOrderMainText}>
                        <Text style={styles.btnOrderText}>
                          Base Price&nbsp;
                        </Text>
                        {currencyFormatter(total)}
                      </Text>
                    )}
                  </View>
                  <Icon
                    style={{paddingRight: 20}}
                    name={CART_OUTLINE_ICON}
                    size={24}
                    color={Colors.onPrimaryColor}
                  />
                </View>
              </TouchableItem>
            </View>
          )}
        </View>
      )}
    </Fragment>
  );
};
const styles = StyleSheet.create({
  topArea: {
    backgroundColor: Colors.background,
  },
  paginationContainer: {
    top: 240,
    width: '100%',
    position: 'absolute',
    // backgroundColor: Colors.onPrimaryColor,
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
    backgroundColor: Colors.primaryColor,
    borderWidth: 1,
    borderColor: 'white',
  },
  image: {
    height: 300,
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
  screenContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.background,
  },
  title: {
    paddingBottom: Layout.SMALL_PADDING,
    fontWeight: 'bold',
    fontSize: 20,
  },
  reviewSection: {
    paddingHorizontal: Layout.MEDIUM_PADDING,
    paddingVertical: Layout.MEDIUM_PADDING,
    borderTopColor: Colors.lightGray,
    borderBottomColor: Colors.lightGray,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  btnOrderMainText: {
    color: Colors.onPrimaryColor,
    fontWeight: 'bold',
    alignContent: 'flex-end',
    textAlign: 'center',
    flex: 1,
    marginLeft: 10,
  },
  btnOrderText: {
    color: Colors.onPrimaryColor,
    fontWeight: 'normal',
    alignContent: 'flex-end',
    textAlign: 'center',
  },
  btnShopContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 5,
    flex: 1,
  },
  btnShopTextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
  },
  btnShopTouchable: {
    borderRadius: 5,
    height: '100%',
    flex: 1,
    marginLeft: Layout.SMALL_MARGIN,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchService,
    },
    dispatch,
  );

export default memo(connect(null, mapDispatchToProps)(ProductDetails));
