import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './lib/firebaseConfig';

export default function EditVideo() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'videos', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTitle(docSnap.data().title);
        setDescription(docSnap.data().description);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, 'videos', id as string);
      await updateDoc(docRef, { title, description });

      alert('✅ Video güncellendi!');
      router.replace('/');
    } catch (err) {
      console.error(err);
      alert('Video güncellenirken hata oluştu.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Başlık"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Açıklama"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <Button mode="contained" onPress={handleUpdate}>
        Güncelle
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  input: { marginBottom: 16 },
});
