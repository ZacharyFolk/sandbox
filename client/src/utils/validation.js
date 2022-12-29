import axios from 'axios';
import { Context } from '../../context/Context';
import { useContext, useState, useRef } from 'react';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});
const { user } = useContext(Context);

const refreshToken = async () => {
  try {
    const res = await axiosInstance.post('/auth/refresh', {
      token: user.refreshToken,
    });
    user.accessToken = res.data.accessToken;
    user.refreshToken = res.data.refreshToken;

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
const axiosJWT = axios.create({ baseURL: process.env.REACT_APP_API_URL });
