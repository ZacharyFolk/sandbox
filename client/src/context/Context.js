import { useEffect } from 'react';
import { createContext, useReducer } from 'react';
import Reducer from './Reducer';
const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isFetching: false,
  error: false,
  //  command: null,
};
export const Context = createContext(INITIAL_STATE);
export const ContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  // useEffect to set localStorage
  // TODO : Here remove accessToken from localStorage so it just stays in memory for user
  // Still store refreshToken and this should work but why is refreshToekn any more secure when it can just be forged to /refresh route
  useEffect(() => {
    // This breaks because the initial request is trying to use this accessToken
    // from localStorage instead of using it from the state.user
    //
    // if (user) {
    //   user.accessToken = '';
    //   console.log('updated user', user);
    // }

    localStorage.setItem('user', JSON.stringify(state.user));
  }, [state.user]);
  // https://reactjs.org/docs/context.html#contextprovider
  // All consumers that are descendants of a Provider will re-render whenever the Provider’s value prop changes
  // changes determined like Object.is

  // useEffect(() => {
  //   console.log('FROM CONTEXT: ', state.command);
  // }, [state.command]);
  return (
    <Context.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        //      command: state.command,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
