import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';

const SplashScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        const email = await AsyncStorage.getItem('email');

        console.log('AccessToken:', credentials.username);
        console.log('RefreshToken:', credentials.password);

        const accessToken = credentials.username;
        const refreshToken = credentials.password;

        if (accessToken && refreshToken && email) {
          console.log('user is logged in:', {accessToken, refreshToken, email});
          setIsLoading(false);
          navigation.replace('Dashboard');
        } else {
          console.log('No credentials found');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error', 'Authentication Failed');
        navigation.replace('Login');
      }
    };

    checkLogin();
  }, []);

  return isLoading ? (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <ActivityIndicator size="large" color="black"></ActivityIndicator>
    </View>
  ) : (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontSize: 30}}>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
