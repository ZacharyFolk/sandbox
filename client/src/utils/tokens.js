import { useContext } from 'react';
import axios from 'axios';
import { Context } from '../context/Context';
import jwt_decode from 'jwt-decode';

const useAxiosJWT = () => {
  const { user } = useContext(Context);
  const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
  });

  const refreshToken = async () => {
    try {
      const res = await axiosInstance.post('/auth/refresh', {
        token: user.refreshToken,
      });
      user.refreshToken = res.data.refreshToken;
      localStorage.setItem('user', JSON.stringify(user));
      user.accessToken = res.data.accessToken;
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const axiosJWT = axios.create({ baseURL: process.env.REACT_APP_API_URL });

  axiosJWT.interceptors.request.use(
    async (config) => {
      let currentDate = new Date();
      const decodedToken = jwt_decode(user.accessToken);
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log('TOKEN HAS EXPIRED, STARTING REFRESH FUNCTION');
        let data = await refreshToken();
        config.headers['Authorization'] = 'Bearer ' + data.accessToken;
      } else {
        config.headers['Authorization'] = 'Bearer ' + user.accessToken;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  return axiosJWT;
};

export default useAxiosJWT;
