import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Video, ResizeMode } from 'expo-av';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebaseConfig';
import { getCommentsByVideoId, Comment } from '../services/commentService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function VideoDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [videoData, setVideoData] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchVideo = async () => {
      const docRef = doc(db, 'videos', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setVideoData(docSnap.data());
      }
    };

    const loadComments = async () => {
      try {
        const videoComments = await getCommentsByVideoId(id as string);
        setComments(videoComments);
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
      }
    };

    fetchVideo();
    loadComments();
  }, [id]);

  if (!videoData) return <Text>Video bulunamadı.</Text>;

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text variant="titleLarge" style={styles.title}>
          {videoData.title}
        </Text>
        <Video
          source={{ uri: videoData.videoUrl }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={styles.video}
        />
        <Text style={styles.description}>{videoData.description}</Text>
        
        <TouchableOpacity 
          style={styles.commentButton}
          onPress={() => router.push({
            pathname: '/comments',
            params: { videoId: id }
          })}
        >
          <MaterialCommunityIcons name="comment-text" size={24} color="white" />
          <Text style={styles.commentButtonText}>Yorumlar ({comments.length})</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  title: {
    marginBottom: 12,
    color: 'white',
    padding: 16,
  },
  video: {
    height: 240,
    width: '100%',
    borderRadius: 8,
  },
  description: {
    color: 'white',
    padding: 16,
  },
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1a1a1a',
    margin: 16,
    borderRadius: 8,
  },
  commentButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
});
