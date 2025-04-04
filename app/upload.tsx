import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  TextInput,
  Button,
  Text,
  ProgressBar,
  Snackbar,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from './lib/firebaseConfig';
import uuid from 'react-native-uuid';
import { useRouter } from 'expo-router';

export default function UploadScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
    }
  };

  const router = useRouter(); // üstte useRouter import edilmiş olmalı.

const handleUpload = async () => {
  if (!title || !videoUri) return;

  setUploading(true);
  setProgress(0);

  let videoBlob;
  try {
    const response = await fetch(videoUri!);
    videoBlob = await response.blob();
  } catch (err) {
    console.error('Video blob alınamadı:', err);
    alert('Video alınırken hata oluştu.');
    setUploading(false);
    return;
  }

  const videoId = uuid.v4();
  const storageRef = ref(storage, `videos/${videoId}.mp4`);
  const uploadTask = uploadBytesResumable(storageRef, videoBlob);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const percent = snapshot.bytesTransferred / snapshot.totalBytes;
      setProgress(percent);
    },
    (error) => {
      console.error('Upload error:', error);
      alert('Yükleme sırasında hata oluştu.');
      setUploading(false);
    },
    async () => {
      try {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

        // BURAYA DİKKAT: Firestore'a ekliyoruz
        await addDoc(collection(db, 'videos'), {
          title,
          description,
          videoUrl: downloadUrl,
        });

        // İşlem tamamlandı mesajı:
        alert('✅ Video başarıyla yüklendi!');

        // State temizliği:
        setUploading(false);
        setProgress(0);
        setTitle('');
        setDescription('');
        setVideoUri(null);

        // ✅ Anasayfaya otomatik dön:
        router.replace('/');

      } catch (err) {
        console.error('Firestore kayıt hatası:', err);
        alert('Video yüklendi ama Firestore kaydı yapılamadı.');
        setUploading(false);
      }
    }
  );
};


  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Video Yükle
      </Text>

      <TextInput
        label="Başlık"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />

      <TextInput
        label="Açıklama"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />

      <Button
        mode="outlined"
        onPress={pickVideo}
        style={styles.input}
        disabled={uploading}
      >
        {videoUri ? 'Videoyu Değiştir' : 'Video Seç'}
      </Button>

      {uploading && (
        <>
          <ProgressBar progress={progress} style={{ marginVertical: 10 }} />
          <Text>Yükleniyor... %{Math.round(progress * 100)}</Text>
        </>
      )}

      <Button
        mode="contained"
        onPress={handleUpload}
        loading={uploading}
        disabled={!videoUri || uploading}
        style={{ marginTop: 10 }}
      >
        Yükle
      </Button>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={Snackbar.DURATION_SHORT}
      >
        Video yükleniyor...
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center' },
  title: { marginBottom: 20 },
  input: { marginBottom: 16 },
});
