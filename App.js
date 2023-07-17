import { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from './authScreen/LoginScreen';
import SignupScreen from './authScreen/SignupScreen';
import ManageExpense from './screens/ManageExpense';
import RecentExpenses from './screens/RecentExpenses';

import AllExpensesScreen from './screens/allExpensesScreen/AllExpensesScreen'
import YearScreen from './screens/allExpensesScreen/YearScreen'
import MonthScreen from './screens/allExpensesScreen/MonthScreen'

import { GlobalStyles } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import ExpensesContextProvider from './store/expenses-context';
import LoginButton from './ui/loginButton';
// import IconButton from './ui/loginButton';

const Stack = createNativeStackNavigator();
const BottomTabs = createBottomTabNavigator();


/* Stack: display screens if user does not log in, show this stack */
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: GlobalStyles.colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

/* Stack: display screens of the expense summary with different time period */
function AllExpensesStack() {
  return (
    <Stack.Navigator
      screenOptions={() => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white'
      })}>
      <Stack.Screen name="Year" component={YearScreen} options={{ title: 'Years' }}/>
      <Stack.Screen name="Month" component={MonthScreen} options={{ title: 'Months' }} />
      <Stack.Screen name="Expense" component={AllExpensesScreen} options={{ title: 'Expenses' }} />
    </Stack.Navigator>
  );
}

/* BottomTab: display screens of Recent expenses & All expenses */
function ExpensesOverview() {
  const authCtx = useContext(AuthContext)
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        headerTintColor: 'white',
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary500 },
        tabBarActiveTintColor: GlobalStyles.colors.accent500,
        headerLeft: ({ tintColor }) => (
          <LoginButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate('ManageExpense');
            }}
          />
        ),
        headerRight: ({ tintColor }) => (
          <LoginButton
            icon="exit"
            color={tintColor}
            size={24}
            onPress={authCtx.logout}
          />
        ),
      })}
    >
      <BottomTabs.Screen
        name="RecentExpenses"
        component={RecentExpenses}
        options={{
          title: 'Recent Expenses',
          tabBarLabel: 'Recent',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      />
      <BottomTabs.Screen
        name="AllExpenses"
        component={AllExpensesStack}
        options={{
          title: 'All Expenses',
          tabBarLabel: 'All Expenses',
          // headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" size={size} color={color} />
          ),
        }}
      />
    </BottomTabs.Navigator>
  );
}

/* display screen according to AuthContext
if the user is not authenticated -> display the AuthStack for logging in & signing up  
if the user is authenticated -> display the ExpensesOverview stack and ManageExpense screen */

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {/* if the user is not authenticated -> display the AuthStack for logging in & signing up  */}
      {!authCtx.isAuthenticated && <AuthStack />}
      {/* if the user is authenticated -> display the Stack Navigation with Expenses overview and Manage Expense */}
      {authCtx.isAuthenticated && (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
            headerTintColor: 'white',
          }}
        >
          <Stack.Screen
            name="Expenses"
            // this refers to function of stack  
            component={ExpensesOverview}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManageExpense"
            component={ManageExpense}
            options={{
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

/* this function is used for the log in process and authentication, it calls the 
navigation function at last */
function Root() {
  // the initial state is true (user is trying to log in)
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  // retrieve the user log in token and local Id, the storeToken is returned, proceed to authentication
  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      const storeduserId = await AsyncStorage.getItem('localId');
      if (storedToken) {  // get the token and do authentication
        authCtx.authenticate(storedToken, storeduserId);
      }
      setIsTryingLogin(false); // update the state 
      SplashScreen.hideAsync();
    }
    fetchToken();
  }, []);

  useEffect(() => {
    if (isTryingLogin) {
      SplashScreen.preventAutoHideAsync();
    }
  }, [isTryingLogin]);

  // display the screen according to authentication status 
  return <Navigation />;
}


export default function App() {
  return (
    <>
      <StatusBar style="light" />
      {/* as we have to use AuthContext & ExpenseContext, need to wrap with the provider  */}
      <AuthContextProvider>
        <ExpensesContextProvider>
          <Root />
        </ExpensesContextProvider>
      </AuthContextProvider>
    </>
  );
}
