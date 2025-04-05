import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoogleLogin from './GoogleLogin';

export default function LoginScreen() {
  const [user, setUser] = useState<any>(null);

  return (
    <View style={styles.container}>
      {user ? (
        <Text style={styles.text}>Hoş geldin, {user.displayName}</Text>
      ) : (
        <GoogleLogin onLogin={setUser} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  text: { color: 'white', fontSize: 22 },
});
