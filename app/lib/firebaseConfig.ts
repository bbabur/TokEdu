import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Firebase config (güncel ve doğru storageBucket ile)
const firebaseConfig = {
    apiKey: "AIzaSyBDFbyU_0O0JozbIpgkqKbU-VQMovvzJUY",
    authDomain: "edutokbabur.firebaseapp.com",
    projectId: "edutokbabur",
    storageBucket: "edutokbabur.firebasestorage.app",
    messagingSenderId: "876157247511",
    appId: "1:876157247511:web:c7384bad0af51c77753c52"
};

// ✅ Firebase başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
