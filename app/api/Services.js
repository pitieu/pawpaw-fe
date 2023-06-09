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

export const callUpdateService = async data => {
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
      _product.weight = {
        start: _product?.weightStart
          ? parseFloat(_product?.weightStart.replaceAll(/,/g, '.') || 0)
          : _product.weight.start,
        end: _product?.weightEnd
          ? parseFloat(_product?.weightEnd.replaceAll(/,/g, '.') || 0)
          : _product.weight.end,
      };
      if (String(_product._id).length < 24) {
        // invalid _id was created with time as placeholder
        delete _product._id;
      }
      delete _product.weightStart;
      delete _product.weightEnd;
      delete _product.id;
      return _product;
    });

    data.products = JSON.stringify(data.products);
    delete data.services;

    if (data.addons?.length > 0) {
      data.product_addons = data.addons.map(product => {
        let _product = {...product};
        _product.price = parseInt(_product.price);
        if (String(_product._id).length < 24) {
          // invalid _id was created with time as placeholder
          delete _product._id;
        }
        delete _product.id;
        return _product;
      });
      data.product_addons = JSON.stringify(data.product_addons);
    }

    delete data.addons;

    const photos = data.photos;
    data.stored_photos = data.photos
      .filter(
        photo =>
          photo.uri.indexOf('http://') > -1 ||
          photo.uri.indexOf('https://') > -1,
      )
      .map(photo => {
        return {
          primary: photo.default,
          filename: photo.fileName,
          content_type: photo.type,
          _id: photo.id,
        };
      });
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
    delete data.category;
    data.stored_photos = JSON.stringify(data.stored_photos);
    const result = createFormData(photos, data);

    const token = await getToken();
    return await axios({
      url: `${config.api_address}services/${data.id}`,
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'put',
      data: result,
    });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
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
      _product.weight = {
        start: parseFloat(_product.weightStart.replaceAll(/,/g, '.') || 0),
        end: parseFloat(_product.weightEnd.replaceAll(/,/g, '.') || 0),
      };
      delete _product.weightStart;
      delete _product.weightEnd;
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
