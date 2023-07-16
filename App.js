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

function Navigation() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && (
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: GlobalStyles.colors.primary500 },
            headerTintColor: 'white',
          }}
        >
          <Stack.Screen
            name="Expenses"
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

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');
      const storeduserId = await AsyncStorage.getItem('localId');

      if (storedToken) {  // get the token
        authCtx.authenticate(storedToken, storeduserId);
      }

      setIsTryingLogin(false);
      SplashScreen.hideAsync();
    }

    fetchToken();
  }, []);

  useEffect(() => {
    if (isTryingLogin) {
      SplashScreen.preventAutoHideAsync();
    }
  }, [isTryingLogin]);

  return <Navigation />;
}


export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <ExpensesContextProvider>
          <Root />
        </ExpensesContextProvider>
      </AuthContextProvider>
    </>
  );
}
