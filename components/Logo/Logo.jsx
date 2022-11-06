import React, { useMemo, useRef, useState } from "react";
import styles from "./Logo.module.scss";

export function Logo() {
  const [animate, setAnimate] = useState(0);

  const dice = useRef(Math.random() > 0.5);
  return dice.current ? (
    <div
      animate={animate}
      onClick={() => setAnimate(1)}
      onAnimationEnd={() => setAnimate(0)}
      className={styles.mangekyou}
    >
      <div className={styles.point}></div>
      <div className={styles.point}></div>
      <div className={styles.point}></div>
      <div className={styles.circle}></div>
    </div>
  ) : (
    <div
      className={styles.sharingan}
      animate={animate}
      onClick={() => setAnimate(1)}
      onAnimationEnd={() => setAnimate(0)}
    >
      <div className={styles.innerRing}>
        <div className={styles.tomoe}></div>
        <div className={styles.tomoe}></div>
        <div className={styles.tomoe}></div>
        <div className={styles.circle}></div>
      </div>
    </div>
  );
}
