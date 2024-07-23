import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

const PowerContext = createContext();

export const usePower = () => useContext(PowerContext);

export const PowerProvider = ({ children }) => {
  const [power, setPower] = useState(() => {
    const cookiePower = Cookies.get('power');
    return cookiePower ? cookiePower === 'true' : false;
  });

  useEffect(() => {
    Cookies.set('power', power);
  }, [power]);

  return (
    <PowerContext.Provider value={{ power, setPower }}>
      {children}
    </PowerContext.Provider>
  );
};
