import { useContext, useState } from 'react';
import { Alert } from 'react-native';

import AuthContent from '../components/Auth/AuthContent';
import LoginLoadingOverlay from '../ui/loginLoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login } from '../util/auth';

function LoginScreen() {
  // initial state is false, indicating authentictaion is not happening
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // AuthContext contain the authentication function and state 
  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true); // update the state
    try {
      // use the login function from util using the email & password input
      const data = await login(email, password);
      // using context authenticate function with idToken and localId
      await authCtx.authenticate(data.idToken, data.localId);
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not log you in. Please check your credentials or try again later!'
      );
      setIsAuthenticating(false); // update the state 
    }
  }

  // if the app is in process of authentication, show a loading overlay 
  if (isAuthenticating) {
    return <LoginLoadingOverlay message="Logging you in..." />;
  }

  // if the app is not in the process of authenticating, show the authentication content
  // and pass the loginHandler function as a prop
  // when the form in the authContent is submitted
  // it should call the onAuthenticated prop which is the loginHandler function containing the email and password value 
  return <AuthContent isLogin onAuthenticate={loginHandler} />;
}

export default LoginScreen;