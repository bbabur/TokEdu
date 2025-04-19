import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { signInWithGoogle } from './lib/supabaseConfig';

export default function GoogleLogin() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Login error:', error.message);
      } else {
        router.replace('/');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handleGoogleLogin}
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
    justifyContent: 'center',
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});