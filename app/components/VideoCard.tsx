import React from 'react';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';

type VideoCardProps = {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
};

const VideoCard: React.FC<VideoCardProps> = ({
  id,
  title,
  description,
  videoUrl,
}) => {
  const router = useRouter();

  return (
    <Card style={{ marginBottom: 16 }}>
      {videoUrl && (
        <Video
          source={{ uri: videoUrl }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={{ height: 250 }}
        />
      )}
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={() => router.push({ pathname: '/edit', params: { id } })}>
          Düzenle
        </Button>
        <Button onPress={() => router.push({ pathname: '/delete', params: { id } })}>
          Sil
        </Button>
      </Card.Actions>
    </Card>
  );
};

export default VideoCard;
