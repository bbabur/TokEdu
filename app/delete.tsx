import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from './lib/firebaseConfig';

export default function DeleteVideo() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const deleteVideo = async () => {
      try {
        const docRef = doc(db, 'videos', id as string);
        const videoDoc = await getDoc(docRef);

        if (videoDoc.exists()) {
          const videoUrl = videoDoc.data().videoUrl;
          const fileRef = ref(storage, videoUrl);
          await deleteObject(fileRef); // Storage'dan sil
          await deleteDoc(docRef);     // Firestore'dan sil
        }

        alert('Video başarıyla silindi!');
        router.replace('/');
      } catch (err) {
        console.error(err);
        alert('Video silinirken hata oluştu.');
        router.replace('/');
      }
    };

    deleteVideo();
  }, [id]);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
