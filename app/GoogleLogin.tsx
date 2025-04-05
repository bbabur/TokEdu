import React, { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from './lib/firebaseConfig'; // Doğru import yolunu kullandığınızdan emin olun
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onLogin: (user: any) => void;
};

export default function GoogleLogin({ onLogin }: Props) {

  // Web ve iOS için ayrı clientID'ler ekleyin
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '320362584797-2ufrt89cdu4klri77oobo57v1kfg29p6.apps.googleusercontent.com', // Expo için
    webClientId: '320362584797-2ufrt89cdu4klri77oobo57v1kfg29p6.apps.googleusercontent.com', // Web için
    androidClientId: '320362584797-ANDROID_CLIENT_ID.apps.googleusercontent.com', // Android için - gerekirse ekleyin
    iosClientId: '320362584797-IOS_CLIENT_ID.apps.googleusercontent.com', // iOS için - gerekirse ekleyin
    redirectUri: 'https://auth.expo.io/@bbabur/TokEdu', // Tam olarak Google Cloud Console'da belirttiğiniz URI
    scopes: ['profile', 'email']
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);  // Google token'ını alıyoruz

      // Firebase ile giriş yapma
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          onLogin(userCredential.user);  // Giriş başarılıysa kullanıcıyı yönlendir
        })
        .catch((err) => {
          console.error('Login Error:', err);
          alert('Login işlemi sırasında bir hata oluştu. Hata: ' + err.message);  // Hata mesajı
        });
    }
  }, [response]);

  return (
    <Button
      mode="contained"
      onPress={() => promptAsync()}
      disabled={!request}  // Eğer request hazır değilse buton devre dışı kalır
      style={{ margin: 20 }}
    >
      Google ile Giriş Yap
    </Button>
  );
}