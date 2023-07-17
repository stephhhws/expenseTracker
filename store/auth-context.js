import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState, useMemo } from 'react';

// create a new context with an initial value 
export const AuthContext = createContext({
  token: '', //  initial token value is empty string
  localId: '', // initial localId value is empty string
  isAuthenticated: false, // initial authentication state is false
  authenticate: (token, localId) => { }, // initial authentication function does nothing
  logout: () => { }, // initial logout functin does nothing
});

// the component that wraps its children with the AuthContext.Provider to provide the state and function
function AuthContextProvider({ children }) {
  // create authToken & authLocalId state 
  const [authToken, setAuthToken] = useState();
  const [authLocalId, setAuthLocalId] = useState();

  // define a function to load authentication data from AsyncStorage 
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        // get the token and localId from AsyncStorage 
        const token = await AsyncStorage.getItem('token');
        const localId = await AsyncStorage.getItem('localId');

        // if the token and localId exist, set them in state 
        if (token && localId) {
          setAuthToken(token);
          setAuthLocalId(localId);
        }
      } catch (error) {
        console.error('Error loading authentication data:', error);
      }
    };
    loadAuthData(); // call the loadAuthData function 
  }, []); // empty dependency array -> run once on component 

  // authenticate function that set the token and localId both in State and AsyncStorage
  async function authenticate(token, localId) {
    setAuthToken(token);
    setAuthLocalId(localId);
    AsyncStorage.setItem('token', token);
    AsyncStorage.setItem('localId', localId);
  }

  // define the logout function that remove the token and localId from both state & AsyncStorage
  function logout() {
    setAuthToken(null);
    setAuthLocalId(null);
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('localId');
  }

  // Use useMemo to only recalculate the value when authToken or authLocalId changes
  const value = useMemo(() => ({
    token: authToken,
    userId: authLocalId,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  }), [authToken, authLocalId]);

  // provide the authentication context to child component 
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;