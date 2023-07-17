import { useContext, useState } from 'react';
import { Alert } from 'react-native';
import { createUserDoc } from '../util/fireBase';
import AuthContent from '../components/Auth/AuthContent';
import LoginLoadingOverlay from '../ui/loginLoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { createUser } from '../util/auth';

function SignupScreen() {
  // initialise the authenticating state to be false 
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // useContext to get the authentcaite method
  const authCtx = useContext(AuthContext);

  // function to handle the signup operation
  async function signupHandler({ email, password }) {
    setIsAuthenticating(true); // update the state 
    try {
      // call createUser function to create a new user with the provided email and password
      const data = await createUser(email, password);
      // call the authenticate method with the idToken and local Id 
      await authCtx.authenticate(data.idToken, data.localId);
      // crate a newUser documeny in the firestore database 
      await createUserDoc(data.localId);

    } catch (error) {
      Alert.alert(
        'Authentication failed',
        'Could not create user, please check your input and try again later.'
      );
      setIsAuthenticating(false); // update the state 
    }
  }

  if (isAuthenticating) {
    return <LoginLoadingOverlay message="Creating user..." />;
  }
  // pass the signUpHandler function as a prop to AuthContent 
  return <AuthContent onAuthenticate={signupHandler} />;
}

export default SignupScreen;