import { supabase } from '../lib/supabaseConfig';

export interface Comment {
  id: string;
  text: string;
  user_id: string;
  video_id: string;
  username: string;
  created_at: string;
}

export const getCommentsByVideoId = async (videoId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('video_id', videoId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
};

export const addComment = async ({
  text,
  username,
  userId,
  videoId,
}: {
  text: string;
  username: string;
  userId: string;
  videoId: string;
}): Promise<Comment | null> => {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        text,
        user_id: userId,
        video_id: videoId,
        username,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }

  return data;
}; 