import React from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@firebaseUtil/auth";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

export default function SignIn() {
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);

  const signInUsingGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      router.push("profile");
    } catch (error) {
      console.log(error);
    }
  };

  if (user) router.push('/profile')

  return (
    <div>
      <button onClick={() => signInUsingGoogle()}>Sign In With Google</button>
    </div>
  );
}
