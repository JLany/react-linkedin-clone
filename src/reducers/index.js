import { combineReducers } from 'redux';

import userReducer from './userReducer';
import postReducer from './postReducer';

const rootReducer = combineReducers({
  userState: userReducer,
  postState: postReducer,
});

export default rootReducer;
