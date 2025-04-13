import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as SystemUI from 'expo-system-ui';
import { UserProvider } from './contexts/UserContext';
import { AuthProvider } from './contexts/AuthContext';

export default function TabLayout() {
  useEffect(() => {
    // Navigation bar'ı siyah yap
    SystemUI.setBackgroundColorAsync('black');
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <Tabs
          screenOptions={{
            tabBarStyle: {
              backgroundColor: '#121212',
              borderTopWidth: 0,
            },
            headerShown: false,
          }}
        >
          {/* Görünmesi gereken sekmeler */}
          <Tabs.Screen
            name="index"
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="home" color={color} size={size} />
              ),
            }}
          />

          <Tabs.Screen
            name="friends"
            options={{
              tabBarLabel: 'Friends',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-group" color={color} size={size} />
              ),
            }}
          />

          <Tabs.Screen
            name="upload"
            options={{
              tabBarLabel: '',
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="plus-box" color="#ff4040" size={40} />
              ),
            }}
          />

          <Tabs.Screen
            name="inbox"
            options={{
              tabBarLabel: 'Inbox',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="inbox" color={color} size={size} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              tabBarLabel: 'Profil',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="account-circle" color={color} size={size} />
              ),
            }}
          />

          {/* Gizlenmesi gerekenler aşağıda */}
          <Tabs.Screen name="(tabs)" options={{ href: null }} />
          <Tabs.Screen name="components" options={{ href: null }} />
          <Tabs.Screen name="video" options={{ href: null }} />    
          <Tabs.Screen name="edit" options={{ href: null }} />
          <Tabs.Screen name="delete" options={{ href: null }} />     
          <Tabs.Screen name="components/VideoCard" options={{ href: null }} />
          <Tabs.Screen name="video/[id]" options={{ href: null }} />
          <Tabs.Screen name="search" options={{ href: null }} />     
          <Tabs.Screen name="GoogleLogin" options={{ href: null }} />
          <Tabs.Screen name="login" options={{ href: null }} />
          <Tabs.Screen name="comments" options={{ href: null }} />
          <Tabs.Screen name="components/CommentInput" options={{ href: null }} />
          <Tabs.Screen name="components/CommentList" options={{ href: null }} />
          <Tabs.Screen name="components/CommentModal" options={{ href: null }} />
        </Tabs>
      </UserProvider>
    </AuthProvider>
  );
}
