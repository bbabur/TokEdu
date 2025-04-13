import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './lib/firebaseConfig'; // Doğru import yolunu kullandığınızdan emin olun
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onLogin: (user: any) => void;
};

export default function GoogleLogin({ onLogin }: Props) {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '320362584797-2ufrt89cdu4klri77oobo57v1kfg29p6.apps.googleusercontent.com',
    webClientId: '320362584797-2ufrt89cdu4klri77oobo57v1kfg29p6.apps.googleusercontent.com',
    androidClientId: '320362584797-ANDROID_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: '320362584797-IOS_CLIENT_ID.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@bbabur/TokEdu',
    scopes: ['profile', 'email']
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          onLogin(userCredential.user);
        })
        .catch((err) => {
          console.error('Login Error:', err);
          alert('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
        });
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <MaterialCommunityIcons name="google" size={24} color="white" />
      <Text style={styles.buttonText}>Google ile Giriş Yap</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4285F4',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});