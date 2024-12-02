import { GET_POSTS, SET_LOADING_STATUS } from '../actions/actionType';

export const initialState = {
  loading: false,
  posts: [],
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LOADING_STATUS: 
      return {
        ...state,
        loading: action.status,
      }
    case GET_POSTS: 
      return {
        ...state,
        posts: action.posts,
      }
    default:
      return state; 
  }
}

export default postReducer;
