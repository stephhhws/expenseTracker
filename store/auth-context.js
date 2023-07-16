import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState, useMemo } from 'react';

export const AuthContext = createContext({
  token: '',
  localId: '',
  isAuthenticated: false,
  authenticate: (token, localId) => { },
  logout: () => { },
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [authLocalId, setAuthLocalId] = useState();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const localId = await AsyncStorage.getItem('localId');

        if (token && localId) {
          setAuthToken(token);
          setAuthLocalId(localId);
        }
      } catch (error) {
        console.error('Error loading authentication data:', error);
      }
    };
    loadAuthData();
  }, []);


  async function authenticate(token, localId) {
    setAuthToken(token);
    setAuthLocalId(localId);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('localId', localId);
  }

  function logout() {
    setAuthToken(null);
    setAuthLocalId(null);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('localId');
  }

  // const value = {
  //   token: authToken,
  //   userId: authLocalId,
  //   isAuthenticated: !!authToken,
  //   authenticate: authenticate,
  //   logout: logout,
  // };
  const value = useMemo(() => ({
    token: authToken,
    userId: authLocalId,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  }), [authToken, authLocalId]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;