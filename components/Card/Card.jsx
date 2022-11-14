import { ListContext } from "context/ListContext";
import Link from "next/link";
import React, { useContext } from "react";
import styles from "./Card.module.scss";
import { toast } from "react-hot-toast";

export function Card({ title, imgUrl, id, type }) {
  const { addToList } = useContext(ListContext);

  const url = type === 'movie' ? '/watch/movies' : `/watch/anime/${id}`
  return (
    <div className={styles.container}>
      {/* <Link href={`/episode/${id}`} className={styles.Card}> */}
      <Link href={{
        pathname: `${url}`,
        query: { id, title },
      }} className={styles.Card}>
        <div className={styles.backdrop}></div>
        <img src={imgUrl} alt={title} />
        <div className={styles.Wrapper}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      </Link>
      {type !== 'movie' && <button
        onClick={(e) => {
          e.stopPropagation();
          addToList(id);
          toast.success("Added to list");
        }}
        className={styles.button}
      >
        +
      </button>}
    </div>
  );
}
