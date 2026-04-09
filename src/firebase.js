import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"

const firebaseConfig = {
  apiKey: "AIzaSyDwd8j0zx0SkjbUvKlo6Zqqi9QOTsF9fI0",
  authDomain: "chatapp-439ec.firebaseapp.com",
  databaseURL: "https://chatapp-439ec-default-rtdb.firebaseio.com",
  projectId: "chatapp-439ec",
  storageBucket: "chatapp-439ec.firebasestorage.app",
  messagingSenderId: "832956323640",
  appId: "1:832956323640:web:2a86abc5407092e4ef93cd"
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)