import { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('user', JSON.stringify(action.payload));
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'LOGOUT':
      localStorage.removeItem('user');
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'INIT_AUTH':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: action.payload.isAuthenticated,
        loading: false
      };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing user in localStorage on app initialization
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({
          type: 'INIT_AUTH',
          payload: { user, isAuthenticated: true }
        });
      } catch (error) {
        localStorage.removeItem('user');
        dispatch({
          type: 'INIT_AUTH',
          payload: { user: null, isAuthenticated: false }
        });
      }
    } else {
      dispatch({
        type: 'INIT_AUTH',
        payload: { user: null, isAuthenticated: false }
      });
    }
  }, []);

  const login = (userData) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: userData });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        setLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};