import Link from "next/link";
import React from "react";
import styles from "./ListAnimeCard.module.scss";

export function ListAnimeCard({ imgUrl, title, id }) {
  return (
    <Link href={`./episode/${id}`} className={styles.Card}>
      <img src={imgUrl} />
      <h3>{title}</h3>
    </Link>
  );
}
