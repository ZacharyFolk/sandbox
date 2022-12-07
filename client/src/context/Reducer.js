const Reducer = (state, action) => {
  console.log('{{{{{{{{{{{{{{ FROM THE REDUCER }}}}}}}}}}}}}}}}}');
  console.log('state: ', state, ' action: ', action);

  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        isFetching: true,
        command: state.command,
        error: false,
      };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload,
        isFetching: false,
        command: state.command,

        error: false,
      };
    case 'LOGIN_FAILURE':
      return {
        user: null,
        isFetching: false,
        command: state.command,

        error: true,
      };
    case 'NEW_COMMAND':
      return {
        command: state.command,
      };
    default:
      return state;
  }
};

export default Reducer;
