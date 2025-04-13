import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import GoogleLogin from './GoogleLogin';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [user, setUser] = useState<any>(null);

  return (
    <View style={styles.container}>
      {user ? (
        <View style={styles.welcomeContainer}>
          <MaterialCommunityIcons name="account-circle" size={80} color="#ff4040" />
          <Text style={styles.welcomeText}>Hoş geldin, {user.displayName}</Text>
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <View style={styles.logoContainer}>
            <MaterialCommunityIcons name="video" size={80} color="#ff4040" />
            <Text style={styles.appName}>TokEdu</Text>
          </View>
          <Text style={styles.slogan}>Eğitim İçeriklerini Keşfet</Text>
          <GoogleLogin onLogin={setUser} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  appName: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  slogan: {
    color: 'white',
    fontSize: 18,
    marginBottom: 40,
    opacity: 0.8,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    marginTop: 20,
    fontWeight: 'bold',
  },
});
