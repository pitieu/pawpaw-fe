// import dependencies
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import I18n from '../assets/i18n/i18n';
import {getToken} from './Auth';
import {Platform} from 'react-native';

// config
import config from '../config';

export const createFormData = (photos, body = {}) => {
  const data = new FormData();
  let primary = '';
  photos.forEach(photo => {
    if (photo.default) primary = photo.fileName;
    data.append('photos', {
      name: photo.fileName,
      type: photo.type,
      uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
    });
  });

  Object.keys(body).forEach(key => {
    data.append(key, body[key]);
  });

  data.append('primary_photo', primary);
  return data;
};

export const callAddService = async data => {
  try {
    data.photos = data.photos.map(photo => {
      const _photo = {...photo};
      _photo.uri =
        Platform.OS === 'ios' ? _photo.uri.replace('file://', '') : _photo.uri;
      return _photo;
    });

    data.products = data.services.map(product => {
      let _product = {...product};
      _product.price = parseInt(_product.price);
      _product.weightStart = parseInt(_product.weightStart || 0);
      _product.weightEnd = parseInt(_product.weightEnd || 0);
      delete _product.id;
      return _product;
    });

    data.products = JSON.stringify(data.products);
    delete data.services;

    if (data.addons?.length > 0) {
      data.product_addons = data.addons.map(product => {
        let _product = {...product};
        _product.price = parseInt(_product.price);
        delete _product.id;
        return _product;
      });
      data.product_addons = JSON.stringify(data.product_addons);
    }
    delete data.addons;

    const photos = data.photos;
    delete data.photos;

    delete data.price;
    data.delivery_location_home = !!data.deliveryLocationHome;
    delete data.deliveryLocationHome;
    data.delivery_location_store = !!data.deliveryLocationStore;
    delete data.deliveryLocationStore;

    if (data.deliveryFee) {
      data.price_per_km = parseInt(data.deliveryFee);
    } else {
      data.price_per_km = 0;
    }
    delete data.deliveryFee;

    if (!data.description) {
      data.description = '';
    }

    const token = await getToken();
    return axios({
      url: `${config.api_address}services/`,
      headers: {
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'post',
      data: createFormData(photos, data),
    });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

export const callListServices = async data => {
  try {
    const token = await getToken();
    return axios({
      url: `${config.api_address}services/`,
      headers: {
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'get',
    });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};

export const callFetchService = async id => {
  try {
    const token = await getToken();
    return axios({
      url: `${config.api_address}services/${id}`,
      headers: {
        'Content-Type': 'multipart/form-data',
        // 'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'get',
    });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
};
