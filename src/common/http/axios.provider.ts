import { Provider } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { NAVER_COMMERCE_API } from '../utils';

export const AXIOS_INSTANCE = Symbol('AXIOS_INSTANCE');

export const axiosProvider: Provider = {
  provide: AXIOS_INSTANCE,
  useFactory: (): AxiosInstance => {
    const baseURL = NAVER_COMMERCE_API.BASE_URL;
    const timeout = 10 * 1000;

    return axios.create({
      baseURL,
      timeout,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
};
