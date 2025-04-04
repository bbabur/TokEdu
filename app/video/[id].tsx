import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Video, ResizeMode } from 'expo-av';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';

export default function VideoDetail() {
  const { id } = useLocalSearchParams();
  const [videoData, setVideoData] = useState<any>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      const docRef = doc(db, 'videos', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVideoData(docSnap.data());
      }
    };

    fetchVideo();
  }, [id]);

  if (!videoData) return <Text>Video bulunamadı.</Text>;

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        {videoData.title}
      </Text>
      <Video
        source={{ uri: videoData.videoUrl }}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        style={styles.video}
      />
      <Text>{videoData.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { marginBottom: 12 },
  video: { height: 240, width: '100%', borderRadius: 8 },
});
