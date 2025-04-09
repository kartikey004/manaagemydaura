import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  RefreshControl,
} from 'react-native';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../redux/authSlice';
import {setVisits} from '../redux/visitSlice';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  // const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const {loading, error, user} = useSelector(state => state.auth);

  const validateEmail = text => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (text === '') {
      setEmailError('Email is required');
    } else if (!emailRegex.test(text)) {
      setEmailError('Enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Error', 'Please enter both email and password.');
        return;
      }
      if (emailError) {
        Alert.alert('Error', 'Please fix the email error before proceeding.');
        return;
      }
      console.log('loginUser dispatched');

      const userData = await dispatch(loginUser({email, password})).unwrap();
      console.log('userData:', userData);
      dispatch(setVisits(userData.upcomingVisits));
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Login failed', error);
    }

    // setLoading(true);

    // try {
    // console.log('Email:', email);
    // console.log('Password:', password);

    // const response = await api.post('/auth/login', {email, password});

    // await AsyncStorage.setItem('accessToken', userData.accessToken);
    // await AsyncStorage.setItem('refreshToken', userData.refreshToken);
    // console.log('userData.accessToken:', userData.accessToken);
    // console.log('userData.refreshToken:', userData.refreshToken);
    // navigation.replace('Dashboard');

    //   console.log('Response:', response.data);

    //   if (response.data && response.data.accessToken) {
    //     await AsyncStorage.setItem('email', response.data.email);
    //     await AsyncStorage.setItem('accessToken', response.data.accessToken);
    //     console.log('upcoming: ', response.data.upcomingVisits);
    //     await AsyncStorage.setItem(
    //       'upcomingVisits',
    //       JSON.stringify(response.data.upcomingVisits),
    //     );

    //     const visits = await AsyncStorage.getItem('upcomingVisits');
    //     console.log('visits: ', visits);
    //     Alert.alert('Success', 'Login successful!', [
    //       {text: 'OK', onPress: () => navigation.replace('Dashboard')},
    //     ]);
    //   } else {
    //     Alert.alert('Error', 'Invalid credentials. Please try again.');
    //   }
    // } catch (error) {
    //   console.error('Login Error:', error.response?.data || error.message);

    //   Alert.alert(
    //     'Login Failed',
    //     error.response?.data?.message ||
    //       'Something went wrong. Please try again.',
    //   );
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'windows' ? 'padding' : 'height'}
        keyboardVerticalOffset={50}
        style={{flex: 1}}>
        <View style={styles.content}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}></Image>
          <Text style={styles.title}>Access Account</Text>
          <Text style={styles.subtitle}>Manage your visits efficiently.</Text>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Your email address"
                placeholderTextColor="#AAAAAA"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={text => {
                  setEmail(text);
                  validateEmail(text);
                }}
              />
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#AAAAAA"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={
                    showPassword
                      ? require('../assets/eye_closed.png')
                      : require('../assets/eye_open.png')
                  }
                  style={styles.eyeIcon}></Image>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Create an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.forgotPassword}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              (emailError || !email || !password) && {opacity: 0.6},
            ]}
            onPress={handleLogin}
            disabled={emailError !== '' || !email || !password || loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF'},
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 40,
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    marginBottom: 10,
    // tintColor: '#635BFF',
    alignSelf: 'center',
  },
  inputWrapper: {marginBottom: 15},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333333',
    fontSize: 15,
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#888',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
  forgotPasswordContainer: {
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row',
  },
  forgotPasswordText: {
    color: '#666666',
    marginRight: 2,
  },
  forgotPassword: {color: '#5151F0', fontSize: 14},
  loginButton: {
    backgroundColor: '#5151F0',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '800'},
});

export default LoginScreen;
