import { useEffect, useState } from 'react';
import axios from 'axios';

const GetFortune = () => {
  const [fortune, setFortune] = useState('');

  useEffect(() => {
    const fetchFortune = async () => {
      const options = {
        method: 'GET',
        url: 'https://fortune-cookie4.p.rapidapi.com/slack',
        headers: {
          'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API,
          'X-RapidAPI-Host': 'fortune-cookie4.p.rapidapi.com',
        },
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
        setFortune(response.data.text);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFortune();
  }, []);

  return <div>{fortune}</div>;
};

export default GetFortune;
