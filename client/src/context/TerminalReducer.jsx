const TerminalReducer = (state, action) => {
  switch (action.type) {
    case 'INIT':
      console.log('reached reducer init');
      break;

    case 'NEW_COMMAND':
      console.log('reached reducer new');
      break;
    default:
      return state;
  }
};
export default TerminalReducer;
