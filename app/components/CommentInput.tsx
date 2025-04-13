import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type CommentInputProps = {
  onCommentSubmit: (comment: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

export default function CommentInput({ 
  onCommentSubmit, 
  placeholder = "Yorum yaz...",
  disabled = false 
}: CommentInputProps) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim() && !disabled) {
      onCommentSubmit(comment.trim());
      setComment('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, disabled && styles.inputDisabled]}
        value={comment}
        onChangeText={setComment}
        placeholder={placeholder}
        placeholderTextColor="#666"
        multiline
        editable={!disabled}
      />
      <TouchableOpacity 
        style={[styles.sendButton, (!comment.trim() || disabled) && styles.sendButtonDisabled]} 
        onPress={handleSubmit}
        disabled={!comment.trim() || disabled}
      >
        <MaterialCommunityIcons 
          name="send" 
          size={24} 
          color={(!comment.trim() || disabled) ? "#666" : "#ff4040"} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  input: {
    flex: 1,
    backgroundColor: '#2a2a2a',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    color: 'white',
    maxHeight: 100,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
}); 