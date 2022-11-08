import React, { useState } from "react";
import styles from "./Swipe.module.scss";
import { Swipe as Swiper } from "node_modules/react-swipe-component/lib/index";

export function Swipe({ MainElem, HiddenElem, className }) {
  if (!MainElem) return;

  const [optionsShown, setOptionsShown] = useState(false);

  const showOptions = () => {
    console.log("show");
    setOptionsShown(true);
  };

  const hideOptions = () => {
    console.log("hide");
    setOptionsShown(false);
  };
  return (
    <Swiper
      node="div"
      className={`${styles.Swiper} ${className}`}
      onSwipedLeft={() => showOptions()}
      onSwipedRight={() => hideOptions()}
      detectTouch
    >
      <MainElem />
      {optionsShown && (
        <div className={styles.Options}>
          <HiddenElem />
        </div>
      )}
    </Swiper>
  );
}
