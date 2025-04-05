import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from './contexts/UserContext';


export default function Profile() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  if (!user) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>👤 {user.displayName}</Text>
      <Text style={styles.text}>📧 {user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  text: { color: 'white', fontSize: 20, marginBottom: 10 },
});
