import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from './contexts/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Wait for auth to be initialized
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && !user) {
      router.replace('/login');
    }
  }, [isInitialized, user, router]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Çıkış yapılırken hata:', error);
    }
  };

  if (!isInitialized || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <View style={styles.profileInfo}>
        <Image
          source={{ uri: user.user_metadata?.picture || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.displayName}>{user.user_metadata?.name || 'Kullanıcı'}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.menuItems}>
        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="video" size={24} color="white" />
          <Text style={styles.menuItemText}>Videolarım</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="heart" size={24} color="white" />
          <Text style={styles.menuItemText}>Beğendiklerim</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <MaterialCommunityIcons name="cog" size={24} color="white" />
          <Text style={styles.menuItemText}>Ayarlar</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
      >
        Çıkış Yap
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  displayName: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  email: {
    color: '#666',
    fontSize: 16,
  },
  menuItems: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuItemText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 16,
    flex: 1,
  },
  logoutButton: {
    margin: 16,
    marginTop: 'auto',
    backgroundColor: '#ff4040',
  },
  logoutButtonContent: {
    paddingVertical: 8,
  },
});
