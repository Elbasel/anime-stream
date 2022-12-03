import React from "react";
import styles from "./Prompt.module.scss";
import { RiCloseCircleFill } from "react-icons/ri";




export  function Prompt({ text = "", options = [] , isShown, onSelect}) {

    if (!isShown) return
  return (
    <div className={styles.container}>
      <div className={styles.prompt}>
        <div className={styles.closeButton}>
          <RiCloseCircleFill />
        </div>
        <h2>{text}</h2>
        <div className={styles.options}>
          {options.map((opt) => (
            <button key={opt} onClick={() => {onSelect(opt)}}>{opt}</button>
          ))}
        </div>
      </div>
    </div>
  );
}
