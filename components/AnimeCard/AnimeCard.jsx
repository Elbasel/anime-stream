import Link from "next/link";
import React from "react";
import styles from "./AnimeCard.module.scss";

export function AnimeCard({ title, imgUrl, id }) {
  return (
    <Link href={`./episode/${id}`} className={styles.Card}>
      <div className={styles.backdrop}></div>
      <img src={imgUrl} alt={title} />
      <div className={styles.Wrapper}>
        <h3>{title}</h3>
      </div>
    </Link>
  );
}
