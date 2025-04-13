import { db } from '../lib/firebaseConfig';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';

export type Comment = {
  id: string;
  text: string;
  username: string;
  userId: string;
  videoId: string;
  timestamp: any;
};

export const addComment = async (comment: Omit<Comment, 'id' | 'timestamp'>) => {
  const docRef = await addDoc(collection(db, 'comments'), {
    ...comment,
    timestamp: serverTimestamp(),
  });
  return { ...comment, id: docRef.id, timestamp: new Date() };
};

export const getCommentsByVideoId = async (videoId: string): Promise<Comment[]> => {
  const commentsQuery = query(
    collection(db, 'comments'),
    where('videoId', '==', videoId),
    orderBy('timestamp', 'desc')
  );
  const querySnapshot = await getDocs(commentsQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate() || new Date(),
  })) as Comment[];
}; 