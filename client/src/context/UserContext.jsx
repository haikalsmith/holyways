import { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

export const UserContext = createContext();

const initialState = {
  isLogin: false,
  user: {},
}

const reducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'USER_SUCCESS':
    case 'LOGIN_SUCCESS':
      
      // Set localstorage item with key "token"
      localStorage.setItem("token", payload.token)

      return {
        isLogin: true,
        user: payload,
      }
    case 'AUTH_ERROR':
    case 'LOGOUT':

      // Remove localstorage item with key "token" 
      localStorage.removeItem("token")

      return {
        isLogin: false,
        user: {},
      }
    default:
      throw new Error();
  }
}

export const UserContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={[state, dispatch]}>
      {children}
    </UserContext.Provider>
  );
}

UserContextProvider.propTypes = {
  children: PropTypes.node.isRequired
};