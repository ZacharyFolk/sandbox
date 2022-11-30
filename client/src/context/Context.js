import { useEffect } from 'react';
import { createContext, useReducer } from 'react';
import Reducer from './Reducer';
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isFetching: false,
  error: false,
};
export const Context = createContext(INITIAL_STATE);

export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  // useEffect to set localStorage

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.user]);
  // https://reactjs.org/docs/context.html#contextprovider
  // All consumers that are descendants of a Provider will re-render whenever the Provider’s value prop changes
  // changes determined like Object.is
  return (
    <Context.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
