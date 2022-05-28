import {getToken} from './Auth';

export const getUser = async () => {
  try {
    const token = await getToken();
    const response = await axios({
      url: `${config.api_address}auth/login`,
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': I18n.language,
        'auth-token': token,
      },
      method: 'get',
      params: {},
    });
    return response;
  } catch (error) {
    // console.log(error);
    // console.log(error.response.data);
    return error.response.data;
  }
};
