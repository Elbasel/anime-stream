import useLocalStorage from "hooks/useLocalStorage";
import React, { createContext, useEffect, useState } from "react";
import { getFromLocalStorage, saveToLocalStorage } from "util/localStorage";

export const ListContext = createContext(null);

export function ListContextProvider({ children }) {
  const [list, setList] = useLocalStorage("userList", []);

  const addToList = (id) => {
    if (list.includes(id)) return;
    setList((prevList) => prevList.concat([id]));
  };

  const getList = () => {
    return list;
  };

  return (
    <ListContext.Provider value={{ addToList, getList }}>
      {children}
    </ListContext.Provider>
  );
}
