import Link from "next/link";
import React from "react";
import styles from "./ListAnimeCard.module.scss";

export function ListAnimeCard({
  imgUrl,
  title,
  id,
  lastEpisodeWatched,
  currentEpisode,
}) {
  return (
    <Link href={`./episode/${id}`} className={styles.Card}>
      <img src={imgUrl} />
      <h3>{title}</h3>
      <div className={styles.aside}>
        <div>
          <p>{lastEpisodeWatched}</p>
          <h4>Last Watched</h4>
        </div>
        <div>
          <p>{currentEpisode}</p>
          <h4>Current</h4>
        </div>
      </div>
    </Link>
  );
}
