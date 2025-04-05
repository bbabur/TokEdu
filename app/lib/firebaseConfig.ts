import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase config (güncel ve doğru storageBucket ile)
export const firebaseConfig = {
  apiKey: "AIzaSyBDFbyU_0O0JozbIpgkqKbU-VQMovvzJUY",
  authDomain: "edutokbabur.firebaseapp.com",
  projectId: "edutokbabur",
  storageBucket: "edutokbabur.appspot.com",
  messagingSenderId: "876157247511",
  appId: "1:876157247511:web:c7384bad0af51c77753c52",
  measurementId: "G-XXXXXX", // Eğer analytics kullanıyorsan
};

// Firebase başlatma
const app = initializeApp(firebaseConfig);

// Firebase servislere erişim
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export edilen servislere erişim
export { auth, db, storage };