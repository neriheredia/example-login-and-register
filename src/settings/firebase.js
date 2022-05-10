import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";

const firebaseConfig = {
  //CONFIG DE FIREBASE
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const addNewColection = async (data) => {
  try {
    await addDoc(collection(db, "chat"), data);
  } catch (error) {
    console.log(error.message);
  }
};

export default app;
