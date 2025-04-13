import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CommentInput from './CommentInput';
import CommentList from './CommentList';
import { Comment } from '../services/commentService';

type CommentModalProps = {
  visible: boolean;
  onClose: () => void;
  onCommentSubmit: (text: string) => void;
  comments: Comment[];
  isLoading: boolean;
};

export default function CommentModal({
  visible,
  onClose,
  onCommentSubmit,
  comments,
  isLoading,
}: CommentModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Yorumlar</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <CommentList comments={comments} isLoading={isLoading} />
          
          <View style={styles.inputContainer}>
            <CommentInput onCommentSubmit={onCommentSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#121212',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#121212',
    borderTopWidth: 1,
    borderTopColor: '#333',
    padding: 16,
  },
}); 