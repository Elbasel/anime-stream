import useLocalStorage from "hooks/useLocalStorage";
import React, { createContext, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "util/localStorage";

export const ListContext = createContext(null);

export function ListContextProvider({ children }) {
  const [list, setList] = useLocalStorage("userList", []);
  const [notificationsList, setNotificationsList] = useLocalStorage(
    "notificationsList",
    []
  );

  const addToList = (id) => {
    if (list.includes(id)) return;
    setList((prevList) => prevList.concat([id]));
  };

  const removeFromList = (id) => {
    setList((prevList) => prevList.filter((elem) => elem !== id));
  };

  const toggleNotifications = (id) => {
    setNotificationsList((prevList) =>
      prevList.includes(id)
        ? prevList.filter((elem) => elem !== id)
        : prevList.concat([id])
    );
  };

  const addToNotifications = (id) => {
    if (notificationsList.includes(id)) return;
    setNotificationsList((prevList) => prevList.concat[id]);
  };

  const removeFromNotifications = (id) => {
    setNotificationsList((prevList) => prevList.filter((elem) => elem !== id));
  };

  return (
    <ListContext.Provider
      value={{
        addToList,
        list,
        setList,
        removeFromList,
        notificationsList,
        // addToNotifications,
        // removeFromNotifications,
        toggleNotifications,
      }}
    >
      {children}
    </ListContext.Provider>
  );
}
