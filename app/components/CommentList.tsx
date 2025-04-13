import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Comment } from '../services/commentService';

type CommentListProps = {
  comments: Comment[] | undefined;
  isLoading?: boolean;
};

export default function CommentList({ comments = [], isLoading = false }: CommentListProps) {
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Şimdi';
    if (minutes < 60) return `${minutes} dakika önce`;
    if (hours < 24) return `${hours} saat önce`;
    return `${days} gün önce`;
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <MaterialCommunityIcons name="account-circle" size={24} color="#ff4040" />
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      </View>
      <Text style={styles.commentText}>{item.text}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4040" />
      </View>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz yorum yok</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  contentContainer: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  commentContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    marginRight: 'auto',
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
  commentText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
}); 