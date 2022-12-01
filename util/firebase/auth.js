import { GoogleAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
export const auth = getAuth();
export const googleProvider = new GoogleAuthProvider();
