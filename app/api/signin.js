// import dependencies
import axios from 'axios';
import I18n from '../assets/i18n/i18n';

// config
import config from '../config';

export const login = async (phone, phoneExt, password) => {
  try {
    const response = await axios({
      url: `${config.api_address}auth/login`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
      },
      method: 'get',
      params: {
        phone_ext: phoneExt,
        phone: phone,
        password: password,
      },
    });
    return response;
  } catch (error) {
    // console.log(error);
    // console.log(error.response.data);
    return error.response.data;
  }
};
