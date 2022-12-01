import React, { useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

import { auth } from "@firebaseUtil/auth";
import { db } from "@firebaseUtil/init";
import { toast } from "react-hot-toast";
import { Loader } from "@components/Loader";
import { ListContext } from "context/ListContext";

export default function Profile() {
  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);
  const { list } = useContext(ListContext);

  const syncUserData = async () => {
    try {
      await setDoc(doc(db, "userLists", user.uid), {
        userID: user.uid,
        userList: list,
      });
      toast.success("Data synced!");
    } catch (e) {
      console.log(e);
    }
  };

  const signOutUser = () => {
    signOut(auth);
  };
  // redirect user to sign-in page if hasn't already signed in
  useEffect(() => {
    if (!user) router.push("/signin");
  }, [user]);

  if (!user || loading) return <Loader />;
  return (
    <div>
        
      <button onClick={() => syncUserData()}>Sync You Data</button>
      <button onClick={() => signOutUser()}>Logout</button>
      <h1>Your Current Watching List:</h1>
      <ul>
        {list.map(item => (
            <li>{item}</li>
        ))}
      </ul>
    </div>
  );
}
