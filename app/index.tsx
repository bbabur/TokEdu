import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { collection, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { db } from './lib/firebaseConfig';
import { Video, ResizeMode } from 'expo-av';

import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';

const { height, width } = Dimensions.get('window');

type VideoItem = {
  id: string;
  title: string;
  videoUrl: string;
  likes: number;
};

export default function Index() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const router = useRouter();
  const videoRefs = useRef<any[]>([]);
  const [activeTab, setActiveTab] = useState<'foryou' | 'following'>('foryou');

  useEffect(() => {
    const fetchVideos = async () => {
      const snapshot = await getDocs(collection(db, 'videos'));
      const videoList: VideoItem[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        videoUrl: doc.data().videoUrl,
        likes: doc.data().likes || 0,
      }));
      setVideos(videoList);
    };

    fetchVideos();
    SystemUI.setBackgroundColorAsync('black');
  }, []);

  const handleLike = async (videoId: string) => {
    const videoRef = doc(db, 'videos', videoId);
    await updateDoc(videoRef, {
      likes: increment(1),
    });
    setVideos(prev =>
      prev.map(v =>
        v.id === videoId ? { ...v, likes: v.likes + 1 } : v
      )
    );
  };

  const renderItem = ({ item, index }: { item: VideoItem; index: number }) => (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.videoContainer}
      onPress={() => {
        videoRefs.current[index].getStatusAsync().then((status: any) => {
          if (status.isPlaying) {
            videoRefs.current[index].pauseAsync();
          } else {
            videoRefs.current[index].playAsync();
          }
        });
      }}
    >
      <Video
        ref={(ref) => (videoRefs.current[index] = ref)}
        source={{ uri: item.videoUrl }}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        useNativeControls={false}
        style={styles.video}
      />

      {/* Açıklama */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.videoTitle}>{item.title}</Text>
      </View>

      {/* Beğeni & Yorum */}
      <View style={styles.actionButtons}>
        <IconButton
          icon="heart"
          iconColor="white"
          size={30}
          onPress={() => handleLike(item.id)}
        />
        <Text style={styles.actionText}>{item.likes}</Text>

        <IconButton
          icon="comment-outline"
          iconColor="white"
          size={30}
          onPress={() => router.push('/comments')}
        />
        <Text style={styles.actionText}>Yorum</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" backgroundColor="black" translucent={false} />
      <View style={styles.topTabs}>
        <Text
          style={[styles.tabText, activeTab === 'foryou' && styles.activeTab]}
          onPress={() => setActiveTab('foryou')}
        >
          For You
        </Text>
        <Text
          style={[styles.tabText, activeTab === 'following' && styles.activeTab]}
          onPress={() => setActiveTab('following')}
        >
          Following
        </Text>
        <IconButton
          icon="magnify"
          iconColor="white"
          size={28}
          style={styles.searchIcon}
          onPress={() => router.push('/search')}
        />
      </View>

      <FlatList
        data={videos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  topTabs: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  tabText: {
    color: 'gray',
    fontSize: 18,
    marginHorizontal: 10,
  },
  activeTab: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  searchIcon: {
    position: 'absolute',
    right: 10,
    top: -5,
  },
  videoContainer: {
    height,
    width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    height: height * 0.92,
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 100,
    left: 10,
    right: 80,
  },
  videoTitle: {
    color: 'white',
    fontSize: 16,
  },
  actionButtons: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    alignItems: 'center',
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
});
