import React, {memo, useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {t} from 'i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// components
import {Subtitle1, Title} from '../text/CustomText';
import NumberButtonsInput from '../textinputs/NumberButtonsInput';

// import utils
import Colors from '../../theme/colors';
import Layout from '../../theme/layout';
import {currencyFormatter} from '../../utils/currency';

const ProductListCard = props => {
  const {title, products, onProductsChange = () => {}} = props;

  const [productsTotal, setProductsTotal] = useState({});

  const updateProductTotal = (product, productCount) => {
    let _product = {};
    _product.count = productCount;
    _product.product = product;
    _product.total = product.price * productCount;

    setProductsTotal(_productsTotal => {
      _productsTotal[product._id] = _product;
      onProductsChange(_productsTotal);
      // console.log('_productsTotal', _productsTotal);
      return _productsTotal;
    });
  };

  const timeExtension = useCallback(time => {
    const timeList = {
      15: {label: '15 minutes'},
      30: {label: '30 minutes'},
      60: {label: '1 hour'},
      120: {label: '2 hours'},
      480: {label: '4 hours'},
      1440: {label: '1 day'},
      10080: {label: '1 week'},
      40320: {label: '1 month'},
    };
    return timeList[time] ? timeList[time].label : time;
  }, []);

  const button = (product, index) => (
    <View
      key={'product_option_' + index}
      style={{
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 10,
      }}>
      <View
        style={{
          marginLeft: 10,
          marginRight: 15,
          flex: 1,
          flexDirection: 'column',
        }}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        {product.description.length > 0 && (
          <Text style={styles.descriptionText} numberOfLines={4}>
            {product.description}
          </Text>
        )}
        <View style={{paddingVertical: 2, flexDirection: 'row'}}>
          {product.weightSelected == true && product.weight != undefined && (
            <View style={styles.badge}>
              <Icon
                name={'weight-kilogram'}
                size={16}
                color={Colors.onBadgeColor}
              />
              <Text style={styles.weightText} numberOfLines={1}>
                {product.weight?.start} to {product.weight?.end}
              </Text>
            </View>
          )}
          {product.timeSelected == true && product.time != undefined && (
            <View style={[styles.badge, {marginLeft: 10}]}>
              <Icon
                name={'clock-time-nine-outline'}
                size={16}
                color={Colors.onBadgeColor}
              />
              <Text style={[styles.timeText]} numberOfLines={1}>
                {timeExtension(product.time)}
              </Text>
            </View>
          )}
        </View>

        <Subtitle1 style={styles.price}>
          {currencyFormatter(product.price)}
        </Subtitle1>
      </View>
      <View
        style={{
          alignContent: 'flex-start',
          flexDirection: 'column',
        }}>
        <NumberButtonsInput
          onChangeText={count => updateProductTotal(product, count)}
        />
      </View>
    </View>
  );
  if (products) {
    return (
      <View style={styles.container}>
        <Title style={styles.title}>{title || ' '}</Title>
        {products &&
          products.map((product, index) => {
            return button(product, index);
          })}
      </View>
    );
  } else {
    return <></>;
  }
};

const styles = StyleSheet.create({
  container: {
    // paddingHorizontal: Layout.MEDIUM_PADDING,
    paddingVertical: Layout.MEDIUM_PADDING,
    borderTopColor: Colors.lightGray,
    borderBottomColor: Colors.lightGray,
    borderTopWidth: 2,
    borderBottomWidth: 2,
  },
  title: {
    paddingHorizontal: Layout.MEDIUM_PADDING,
  },
  productName: {
    fontSize: 18,
  },
  price: {
    color: Colors.focusColor,
    marginTop: 0,
    textAlign: 'left',
    marginBottom: 5,
    // marginRight: Layout.MEDIUM_PADDING,
    // marginLeft: Layout.MEDIUM_PADDING,
    fontWeight: 'bold',
  },
  fontBold: {
    // fontWeight: 'bold',
  },
  groupContainer: {
    marginLeft: 0,
    marginRight: 0,
    borderWidth: 0,
  },
  selectedButtonStyle: {
    backgroundColor: 'transparent',
  },
  buttonStyle: {
    paddingLeft: 5,
  },
  descriptionText: {
    color: Colors.gray,
    marginTop: 3,
    marginBottom: 3,
  },
  weightText: {
    color: Colors.onBadgeColor,
    marginLeft: 10,
  },
  timeText: {
    color: Colors.onBadgeColor,
    marginLeft: 10,
  },
  badge: {
    flexDirection: 'row',
    backgroundColor: Colors.badgeColor,
    padding: 2,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    // borderColor: Colors.focusColor,
    // borderWidth: 1,
  },
});

export default memo(ProductListCard);
