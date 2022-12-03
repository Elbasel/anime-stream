import { doc, getDoc } from "firebase/firestore";
import { db } from "@firebaseUtil/init";

export const getUserList = async (userId) => {
  const userListDoc = doc(db, "userLists", userId);
  const userListDocSnap = await getDoc(userListDoc);

  return userListDocSnap.data();
};
