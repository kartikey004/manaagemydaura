import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
// import {useNavigation} from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://192.168.190.101:3000/api',

  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token in all requests
api.interceptors.request.use(
  async config => {
    const credentials = await Keychain.getGenericPassword();
    if (credentials) {
      config.headers['authorization'] = `Bearer ${credentials.username}`; //accessToken
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

// const navigation = useNavigation();

// Add a response interceptor to handle 403 errors (expired tokens)
api.interceptors.response.use(
  response => {
    return response;
  },
  async error => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      console.log('Access token expired. Attempting to refresh...');
      const success = await refreshAccessToken();
      if (success) {
        const credentials = await Keychain.getGenericPassword();
        // Retry the original request with the new token
        if (credentials) {
          const newAccessToken = credentials.username;
          console.log('newAccessToken: ', newAccessToken);
          originalRequest.headers['authorization'] = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }
      } else {
        Alert.alert('Session Expired', 'Please log in again.');
      }
    }

    return Promise.reject(error);
  },
);

// Token refresh function
// const refreshAccessToken = async () => {
//   try {
//     console.log('Requesting new access token...');
//     const response = await axios.get('http://192.168.143.50:3000/api', {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     if (response.data.success) {
//       const newAccessToken = response.data.token;
//       await AsyncStorage.setItem('accessToken', newAccessToken);
//       console.log('New access token stored:', newAccessToken);
//       return true;
//     } else {
//       const navigation = useNavigation();
//       Alert.alert('Cookie Expires', 'Please Login again!');
//       navigation.navigate('Login');

//       console.error('Failed to refresh token:', response.data.message);
//     }
//   } catch (error) {
//     const navigation = useNavigation();
//     Alert.alert('Cookie Expires', 'Please Login again!');
//     navigation.navigate('Login');
//     console.error('Error refreshing access token:', error);
//   }
//   return false;
// };
const refreshAccessToken = async () => {
  try {
    console.log('Requesting new access token...');
    const credentials = await Keychain.getGenericPassword();
    if (!credentials) return false;

    const refreshToken = credentials.password;
    const response = await axios.get('http://192.168.190.101:3000/api', {
      token: refreshToken,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.data.success && response.data.accessToken) {
      const newAccessToken = response.data.token;
      await Keychain.setGenericPassword(
        response.data.accessToken,
        refreshToken,
      );
      console.log('New access token stored:', newAccessToken);
      return true;
    } else {
      console.error('Failed to refresh token:', response.data.message);
      // Instead of navigation here, return a status that can trigger navigation
      return 'SESSION_EXPIRED';
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return 'SESSION_EXPIRED';
  }
  return false;
};

export default api;
