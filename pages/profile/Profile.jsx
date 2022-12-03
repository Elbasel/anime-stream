import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";

import { auth } from "@firebaseUtil/auth";
import { db } from "@firebaseUtil/init";
import { Loader } from "@components/Loader";
import { ListContext } from "context/ListContext";
import { getUserList } from "@firebaseUtil/getUserList";
import { fetchAll } from "util/fetchAnimeList";
import { Prompt } from "@components/Prompt";


import styles from './Profile.module.scss'

let savedResolve = null;

export default function Profile() {
  const router = useRouter();

  const [user] = useAuthState(auth);
  const [onlineUserList, setOnlineUserList] = useState(null);
  const [offlineUserList, setOfflineUserList] = useState(null);
  const [promptShown, setPromptShown] = useState(false);

  const { list, setList } = useContext(ListContext);

  const syncUserData = async () => {

    const onlineList = (await getUserList(user.uid))?.userList
    if (list.sort().join() == onlineList.sort().join()) {
      toast.success('Data is already synced!')
      return
    
    }

    const userInput = await getInput();
    if (userInput === "Online Data") {
      setList((await getUserList(user.uid))?.userList);
      toast.success("Data synced!");
      return;
    }

    try {
      await setDoc(doc(db, "userLists", user.uid), {
        userID: user.uid,
        userList: list,
      });
      toast.success("Data synced!");
    } catch (e) {
      console.log(e);
    }
    getOnlineUserList()
  };

  const signOutUser = () => {
    signOut(auth);
  };
  // redirect user to sign-in page if hasn't already signed in
  useEffect(() => {
    if (!user) router.push("/signin");
  }, [user]);

  const getOnlineUserList = async (user) => {
    const onlineUserList = (await getUserList(user.uid))?.userList;
    if (!onlineUserList) return setOnlineUserList([]);
    const animeList = await fetchAll(onlineUserList);
    setOnlineUserList(animeList);
  };

  const getOfflineList = async () => {
    const offlineList = await fetchAll(list);
    setOfflineUserList(offlineList);
  };

  useEffect(() => {
    if (!user) return;
    getOnlineUserList(user);
    getOfflineList();
  }, [user]);

  const getInput = async () => {
    setPromptShown(true);

    const promise = new Promise((resolve, reject) => {
      savedResolve = (value) => {
        setPromptShown(false);
        resolve(value);
      };
    });

    return await promise;
  };

  if (!user || !onlineUserList || !offlineUserList) return <Loader />;
  return (
    <main className={styles.container}>
      <Prompt
        isShown={promptShown}
        text="Which Data do you want to keep?"
        options={["Local Data", "Online Data"]}
        onSelect={(opt) => {
          savedResolve(opt);
        }}
        onClose ={() => {}}
      />

      <header className={styles.header}>
      <div className={styles.userContainer}>
          <img src={user.photoURL}  />
          {user.displayName}
        </div>
        <div className={styles.buttons}>
          <button onClick={() => syncUserData()}>Sync You Data</button>
          <button onClick={() => signOutUser()}>Logout</button>
        </div>

      </header>
      <section className={styles.listCompare}>
        <div className={styles.list}>
          <h2>Online List</h2>
          <ul>
            {onlineUserList.map((anime) => (
              <li key={anime.animeTitle}>{anime.animeTitle}</li>
            ))}
          </ul>
        </div>
        <div className={styles.list}>
          <h2>Local List</h2>
          <ul>
            {offlineUserList.map((anime) => (
              <li key={anime.animeTitle}>{anime.animeTitle}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
