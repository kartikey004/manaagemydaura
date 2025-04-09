import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DashboardScreen from './src/screens/DashboardScreen';
import LoginScreen from './src/screens/LoginScreen';
import LaunchScreen from './src/screens/LaunchScreen';
import {NavigationContainer} from '@react-navigation/native';
import {MenuProvider} from 'react-native-popup-menu';
import SignupScreen from './src/screens/SignupScreen';
// import SplashScreen from './src/screens/SplashScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Launch"
          screenOptions={{headerShown: false}}>
          {/* <Stack.Screen name="Splash" component={SplashScreen}></Stack.Screen> */}
          <Stack.Screen name="Launch" component={LaunchScreen}></Stack.Screen>
          <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen
            name="Dashboard"
            component={DashboardScreen}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
};

export default App;
