import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';

const supabaseUrl = 'https://hjpykaglufzuwidcxyyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqcHlrYWdsdWZ6dXdpZGN4eXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA2OTU5NzAsImV4cCI6MjAyNjI3MTk3MH0.Hs-Nx0HQZcMCbhkHZI-KBGFYNUZy_-YwXtoXHxHJk8Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth functions
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'tokedu://auth/callback',
    },
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Video functions
export const uploadVideo = async (
  videoUri: string,
  thumbnailUri: string,
  title: string,
  description: string,
  userId: string
) => {
  try {
    // Upload video file
    const videoFileName = `${userId}/${Date.now()}-video`;
    const videoResponse = await fetch(videoUri);
    const videoBlob = await videoResponse.blob();
    const { data: videoData, error: videoError } = await supabase.storage
      .from('videos')
      .upload(videoFileName, videoBlob);

    if (videoError) throw videoError;

    // Upload thumbnail
    const thumbnailFileName = `${userId}/${Date.now()}-thumbnail`;
    const thumbnailResponse = await fetch(thumbnailUri);
    const thumbnailBlob = await thumbnailResponse.blob();
    const { data: thumbnailData, error: thumbnailError } = await supabase.storage
      .from('thumbnails')
      .upload(thumbnailFileName, thumbnailBlob);

    if (thumbnailError) throw thumbnailError;

    // Create video record in database
    const { data: video, error: dbError } = await supabase
      .from('videos')
      .insert([
        {
          title,
          description,
          video_url: videoData.path,
          thumbnail_url: thumbnailData.path,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (dbError) throw dbError;

    return { data: video, error: null };
  } catch (error) {
    console.error('Error uploading video:', error);
    return { data: null, error };
  }
};

export const getVideos = async (page = 1, limit = 10) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      user:auth.users(id, email, raw_user_meta_data),
      comments:comments(count),
      likes:likes(count)
    `)
    .order('created_at', { ascending: false })
    .range(from, to);

  return { data, error };
};

export const getVideoById = async (videoId: string) => {
  const { data, error } = await supabase
    .from('videos')
    .select(`
      *,
      user:auth.users(id, email, raw_user_meta_data),
      comments:comments(count),
      likes:likes(count)
    `)
    .eq('id', videoId)
    .single();

  return { data, error };
};

// Comment functions
export const getComments = async (videoId: string) => {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:auth.users(id, email, raw_user_meta_data)
    `)
    .eq('video_id', videoId)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const addComment = async (comment: {
  text: string;
  user_id: string;
  video_id: string;
}) => {
  const { data, error } = await supabase
    .from('comments')
    .insert([comment])
    .select(`
      *,
      user:auth.users(id, email, raw_user_meta_data)
    `)
    .single();

  return { data, error };
};

// Like functions
export const toggleLike = async (videoId: string, userId: string) => {
  const { data: existingLike } = await supabase
    .from('likes')
    .select()
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .single();

  if (existingLike) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('video_id', videoId)
      .eq('user_id', userId);

    return { data: { liked: false }, error };
  } else {
    const { error } = await supabase
      .from('likes')
      .insert([{ video_id: videoId, user_id: userId }]);

    return { data: { liked: true }, error };
  }
};

export const checkLikeStatus = async (videoId: string, userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select()
    .eq('video_id', videoId)
    .eq('user_id', userId)
    .single();

  return { data: !!data, error };
}; 