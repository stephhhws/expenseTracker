import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { createUserDoc } from '../util/fireBase';
import AuthContent from '../components/Auth/AuthContent';
import LoginLoadingOverlay from '../ui/loginLoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { createUser } from '../util/auth';

function SignupScreen() {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const data = await createUser(email, password);
      await authCtx.authenticate(data.idToken, data.localId);
      await createUserDoc(data.localId);

    } catch (error) {
      Alert.alert(
        'Authentication failed',
        'Could not create user, please check your input and try again later.'
      );
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoginLoadingOverlay message="Creating user..." />;
  }

  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;