import React, { useState } from "react";
import styles from "./Swipe.module.scss";
import { Swipe as Swiper } from "node_modules/react-swipe-component/lib/index";

export function Swipe({ MainElem, HiddenElem, className }) {
  if (!MainElem) return;

  const [optionsShown, setOptionsShown] = useState(false);

  const showOptions = () => {
    setOptionsShown(true);
  };

  const hideOptions = () => {
    setOptionsShown(false);
  };
  return (
    <Swiper
      node="div"
      className={`${styles.Swiper} ${className}`}
      onSwipedLeft={() => showOptions()}
      onSwipedRight={() => hideOptions()}
      delta={100}
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
