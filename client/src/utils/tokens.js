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
      console.log('REFRESH TOKEN - user : ', user.refreshToken);
      const res = await axiosInstance.post('/auth/refresh', {
        token: user.refreshToken,
      });
      user.accessToken = res.data.accessToken;
      user.refreshToken = res.data.refreshToken;
      localStorage.setItem('user', JSON.stringify(user));
      return res.data;
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Handle the error based on the type of error
      if (error.response && error.response.status === 401) {
        // Unauthorized error, likely due to expired refresh token
        console.log('User is not authenticated. ');
      } else {
        console.log('An error occurred. Please try again later.');
      }
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
        console.log('DATA : ', data);
        config.headers['Authorization'] = 'Bearer ' + data.accessToken;
      } else {
        config.headers['Authorization'] = 'Bearer ' + user.accessToken;
      }
      return config;
    },
    (error) => {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  );
  return axiosJWT;
};

export default useAxiosJWT;
