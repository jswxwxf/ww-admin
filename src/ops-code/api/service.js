import router from '../router';
import axios from 'axios';
import { encrypt, removeToken, removeKey, removeLoginTimeout } from '@/utils/auth';
import { getToken } from '../utils/auth';
import sha512 from 'js-sha512';
import mcwssamlMockData from './mcwssaml.json';
import { get } from 'lodash';
import { message } from '@/utils/helpers';

const TokenKey = 'XSRF-TOKEN';
axios.defaults.withCredentials = true;

export function init(service) {
  const hashSalt = (config) => {
    if (config.method === 'post') {
      const bodyData = config.data ? JSON.stringify(config.data) : '';
      const saltKey = '724E6593B44D47E9C107E40E252DB6AD';
      if (config.data && Object.hasOwnProperty.call(config.data, 'checksum')) {
        config.headers['checksum'] = config.data.checksum;
        config.data = config.data.file;
      } else {
        const SIGNATURE = sha512(saltKey + bodyData);
        config.headers['Signature'] = SIGNATURE;
      }
    }
  };

  const encryptData = async (config) => {
    if (encryptList.indexOf(config.url) > -1) {
      config.headers['content-type'] = 'application/json';
      config.headers['encrypted'] = true;
      const encryptor = await encrypt(config.url);
      const data = encryptor.encrypt(JSON.stringify(config.data));
      config.data = data;
    }
  };

  // Tell backend current lanauge for internationalization
  const setLang = (config) => {
    config.headers['Accept-Language'] = getToken('lang') ? getToken('lang') : 'en-US';
  };

  const encryptList = ['/auth/login'];

  const eportalMockFunc = () => {
    const logOnUser = getToken('logOnUser');
    if (!enableLdap && logOnUser) {
      return Object.prototype.hasOwnProperty.call(mcwssamlMockData, logOnUser)
        ? { mcwssaml: mcwssamlMockData[logOnUser] }
        : { mcwssaml: {} };
    } else {
      return { mcwssaml: {} };
    }
  };

  service.interceptors.request.use(
    async (config) => {
      const { isdownload, ...data } = config.data || {};
      if (data !== undefined) {
        if (isdownload) {
          config.responseType = 'blob';
        }
      }
      config.headers['X-XSRF-TOKEN'] = getToken(TokenKey) ? getToken(TokenKey) : '';
      const eportalMock = eportalMockFunc();
      if (Object.values(eportalMock.mcwssaml).length > 0) {
        config.headers = Object.assign(config.headers, eportalMock);
      }

      // Encrypt Login information
      await encryptData(config);
      setLang(config);
      hashSalt(config);
      return config;
    },
    () => {
      return 'error';
    },
  );

  // Redirect to login page if Eportal session timeout
  const argusSessionValid = (response) => {
    if (response.data && response.data.toString().indexOf('Mastercard - Authnz') > -1) {
      router.go(0);
      return false;
    } else {
      return true;
    }
  };

  const ieAdminSessionValid = (response) => {
    const errMessage = response.message || response.data.message;
    message(errMessage, {
      type: 'error',
    });
    window.setTimeout(() => {
      router.go(0);
    }, 1000);
    removeToken('XSRF-TOKEN');
    removeToken('userInfo');
    removeKey();
    removeLoginTimeout();
    return {};
  };

  const normalResponseHandling = (response) => {
    if (get(response, 'data.resultCode') > 0) {
      const errMsg = get(response, 'data.message') || get(response, 'message');
      message(errMsg, {
        type: 'error',
      });
      return Promise.reject(response);
    }
    return response;
  };

  const errResponseHandling = (err) => {
    // IEOPS00206000 Failed Authentication
    // IEOPS00209000 Permission Deinied
    // IEOPS00100001 Invalid Request Data
    const statusCode = get(err, 'response.data.statusCode');
    const errMsg = get(err, 'response.data.message') || 'System error, please contact the administrator.';
    message(errMsg, {
      type: 'error',
    });
    if (['IEOPS00209000', 'IEOPS00206000'].includes(statusCode)) {
      router.push({ path: '/403' });
    }
    return Promise.reject(err);
  };

  // response interceptor
  service.interceptors.response.use(
    (response) => {
      if (!argusSessionValid(response)) {
        return Promise.reject(response);
      }
      // Handle Seesion Timeout
      if (get(response, 'data.statusCode') === 'IEOPS002060001') {
        return ieAdminSessionValid(response);
      }
      return normalResponseHandling(response);
    },
    (err) => {
      return errResponseHandling(err);
    },
  );
  return service;
}
