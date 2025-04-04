import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './lib/firebaseConfig';
import VideoCard from './components/VideoCard';
import { useRouter } from 'expo-router';

type Video = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  thumbnail?: string;
};

export default function HomeScreen() {
  const [videos, setVideos] = useState<Video[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchVideos = async () => {
      const snapshot = await getDocs(collection(db, 'videos'));
      const videoList: Video[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Video, 'id'>),
      }));
      setVideos(videoList);
    };

    fetchVideos();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button
        mode="contained"
        onPress={() => router.push('/upload')}
        style={{ marginBottom: 20 }}
      >
        Video Ekle
      </Button>

      {videos.map((video) => (
        <VideoCard
          key={video.id}
          id={video.id}
          title={video.title}
          description={video.description}
          videoUrl={video.videoUrl}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
