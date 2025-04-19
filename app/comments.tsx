import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getVideoById, getComments, addComment } from './lib/supabaseConfig';
import { useAuth } from './contexts/AuthContext';
import CommentInput from './components/CommentInput';
import CommentList from './components/CommentList';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export interface Comment {
  id: string;
  text: string;
  user_id: string;
  video_id: string;
  created_at: string;
  user: {
    id: string;
    email: string;
    raw_user_meta_data: {
      name: string;
      picture: string;
    };
  };
}

export default function CommentsScreen() {
  const { videoId } = useLocalSearchParams<{ videoId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [videoData, setVideoData] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!videoId) {
      router.back();
      return;
    }

    const fetchVideo = async () => {
      try {
        const { data, error } = await getVideoById(videoId);
        if (error) {
          console.error('Video yüklenirken hata:', error);
          return;
        }
        if (data) {
          setVideoData(data);
        }
      } catch (error) {
        console.error('Video yüklenirken hata:', error);
      }
    };

    const loadComments = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await getComments(videoId);
        if (error) {
          console.error('Yorumlar yüklenirken hata:', error);
          return;
        }
        if (!data) {
          setComments([]);
          return;
        }
        // Type assertion since we know the shape from the database
        setComments(data as unknown as Comment[]);
      } catch (error) {
        console.error('Yorumlar yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideo();
    loadComments();
  }, [videoId, router]);

  const handleCommentSubmit = async (text: string) => {
    if (!user || !videoId) return;

    try {
      const { data, error } = await addComment({
        text,
        user_id: user.id,
        video_id: videoId,
      });

      if (error) {
        console.error('Yorum eklenirken hata:', error);
        return;
      }
      if (data) {
        const newComment: Comment = {
          id: (data as any).id,
          text: (data as any).text,
          user_id: (data as any).user_id,
          video_id: (data as any).video_id,
          created_at: (data as any).created_at,
          user: {
            id: user.id,
            email: user.email || '',
            raw_user_meta_data: {
              name: user.user_metadata?.name || 'Kullanıcı',
              picture: user.user_metadata?.picture || 'https://via.placeholder.com/150'
            }
          }
        };
        setComments([newComment, ...comments]);
      }
    } catch (error) {
      console.error('Yorum eklenirken hata:', error);
    }
  };

  if (!videoId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video bulunamadı</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          <Text style={styles.backButtonText}>Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!videoData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Video yükleniyor...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Yorumlar</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{videoData.title}</Text>
          <Text style={styles.commentCount}>{comments.length} yorum</Text>
        </View>

        <CommentList comments={comments} isLoading={isLoading} />
      </ScrollView>

      <View style={styles.inputContainer}>
        <CommentInput 
          onCommentSubmit={handleCommentSubmit}
          placeholder={user ? "Yorum yaz..." : "Yorum yazmak için giriş yapın"}
          disabled={!user}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  scrollView: {
    flex: 1,
  },
  videoInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  videoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  commentCount: {
    color: '#666',
    fontSize: 14,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  inputContainer: {
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
}); 