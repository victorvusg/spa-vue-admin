import axios from 'axios';
import { router } from '../route';

export const getToken = () => JSON.parse(localStorage.getItem('jwt-token'));

export const defaultPaginationParams = {
  per_page: 99999,
};

export const axiosFactory = (url = '') => {
  const instance = axios.create({
    baseURL: `${process.env.VUE_APP_API_BASE_URL}/${url}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.common.Authorization = `Bearer ${token}`;
        // config.headers.common['Content-Type'] = 'application/jso';
        config.headers.common['User-Type'] = 'admin';
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => {
      if (response.status === 200 || response.status === 201) {
        return Promise.resolve(response);
      }
      return Promise.reject(response);
    },
    (error) => {
      console.log(error);
      if (error.response.status === 401) {
        localStorage.removeItem('jwt-token');
        router.push({ path: '/Login' }).catch((routerError) => {
          console.log(routerError);
        });
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

// Public Axios Instance with base URL
export const publicAxios = axiosFactory();

// Create private Axios that attached token for request
export const privateAxios = axiosFactory();

export const validToken = async () => {
  try {
    const tokenValidation = await privateAxios.get(
      process.env.VUE_APP_CLIENT_API_ENDPOINT_VALID_TOKEN,
    );
    if (tokenValidation.isSuccess === false) {
      return false;
    }
    return true;
  } catch (error) {
    // console.log(error);
    // TODO: error handling
    return false;
  }
};
