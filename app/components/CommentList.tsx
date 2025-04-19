import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { Comment } from '../comments';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
}

export default function CommentList({ comments, isLoading }: CommentListProps) {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Yorumlar yükleniyor...</Text>
      </View>
    );
  }

  if (comments.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Henüz yorum yok</Text>
      </View>
    );
  }

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <Avatar.Image 
        size={40} 
        source={{ uri: item.user.raw_user_meta_data.picture || 'https://via.placeholder.com/40' }} 
      />
      <View style={styles.commentContent}>
        <Text style={styles.username}>{item.user.raw_user_meta_data.name || 'Anonim'}</Text>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {new Date(item.created_at).toLocaleDateString('tr-TR')}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={comments}
      renderItem={renderComment}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  commentContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentText: {
    color: 'white',
    marginBottom: 4,
  },
  timestamp: {
    color: '#666',
    fontSize: 12,
  },
}); 