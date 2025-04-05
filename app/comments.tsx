import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Comments() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>💬 Yorumlar buraya gelecek...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' },
  text: { color: 'white', fontSize: 22 },
});
