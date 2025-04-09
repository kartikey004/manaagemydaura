import React, {useState} from 'react';
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
} from 'react-native';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const validateEmail = text => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(
      text === ''
        ? 'Email is required'
        : !emailRegex.test(text)
        ? 'Enter a valid email address'
        : '',
    );
  };

  const validatePhone = text => {
    setPhone(text);
    const phoneRegex = /^[6-9]\d{9}$/;
    setPhoneError(
      text === ''
        ? 'Phone number is required'
        : !phoneRegex.test(text)
        ? 'Enter a valid 10-digit phone number'
        : '',
    );
  };
  const handleSignUp = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    if (emailError || phoneError) {
      Alert.alert('Error', 'Please fix the errors before proceeding.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        phone,
        password,
      });

      if (response.data) {
        await AsyncStorage.setItem('userEmail', email); // Save email in AsyncStorage
        Alert.alert('Success', 'Registration successful! Please login now.', [
          {text: 'OK', onPress: () => navigation?.replace('Login')},
        ]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error(
        'Registration Error:',
        error.response?.data || error.message,
      );
      Alert.alert(
        'Registration Failed',
        error.response?.data?.message ||
          'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  // const handleSignUp = async () => {
  //   if (!name || !email || !phone || !password) {
  //     Alert.alert('Error', 'All fields are required.');
  //     return;
  //   }

  //   if (emailError || phoneError) {
  //     Alert.alert('Error', 'Please fix the errors before proceeding.');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const response = await api.post('/auth/register', {
  //       name,
  //       email,
  //       phone,
  //       password,
  //     });

  //     if (response.data) {
  //       await AsyncStorage.multiSet([
  //         ['userEmail', email],
  //         ['accessToken', response.data.accessToken],
  //         ['refreshToken', response.data.refreshToken],
  //       ]);

  //       Alert.alert('Success', 'Registration successful! Please login now. ', [
  //         {text: 'OK', onPress: () => navigation?.replace('Login')},
  //       ]);
  //     } else {
  //       throw new Error('Invalid response from server');
  //     }
  //   } catch (error) {
  //     console.error(
  //       'Registration Error:',
  //       error.response?.data || error.message,
  //     );
  //     Alert.alert(
  //       'Registration Failed',
  //       error.response?.data?.message ||
  //         'Something went wrong. Please try again.',
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'windows' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
        style={{flex: 1}}>
        <View style={styles.content}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}></Image>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start managing your visits efficiently.
          </Text>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Your name"
              placeholderTextColor="#AAAAAA"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Your email address"
              placeholderTextColor="#AAAAAA"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={validateEmail}
            />
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Your phone number"
              placeholderTextColor="#AAAAAA"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={validatePhone}
            />
            {phoneError ? (
              <Text style={styles.errorText}>{phoneError}</Text>
            ) : null}
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#AAAAAA"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.signUpButton, loading && {opacity: 0.6}]}
            onPress={handleSignUp}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLinkText}>Log In</Text>
            </TouchableOpacity>
          </View>
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
  logo: {
    marginTop: 20,
    width: 90,
    height: 90,
    // marginBottom: 1,
    // tintColor: '#635BFF',
    alignSelf: 'center',
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
  inputWrapper: {marginBottom: 15},
  input: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#555',
  },
  errorText: {color: 'red', fontSize: 12, marginTop: 5},
  signUpButton: {
    backgroundColor: '#5151F0',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {color: '#666666', fontSize: 14, marginRight: 5},
  loginLinkText: {color: '#5151F0', fontSize: 14, fontWeight: '600'},
});

export default SignupScreen;
