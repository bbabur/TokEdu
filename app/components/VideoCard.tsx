import React from 'react';
import { Card, Title, Paragraph } from 'react-native-paper';
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
    <Card
      style={{ marginBottom: 16 }}
      onPress={() =>
        router.push({
          pathname: '/video/[id]',
          params: { id },
        })
      }
    >
      {videoUrl ? (
        <Video
          source={{ uri: videoUrl }}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN}
          style={{ height: 250 }}
        />
      ) : (
        <Card.Cover source={{ uri: 'https://via.placeholder.com/300x200' }} />
      )}
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{description}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default VideoCard;
