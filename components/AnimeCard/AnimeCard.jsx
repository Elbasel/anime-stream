import { ListContext } from "context/ListContext";
import Link from "next/link";
import React, { useContext } from "react";
import styles from "./AnimeCard.module.scss";
import { toast } from "react-hot-toast";

export function AnimeCard({ title, imgUrl, id }) {
  const { addToList } = useContext(ListContext);

  return (
    <div className={styles.container}>
      <Link href={`./episode/${id}`} className={styles.Card}>
        <div className={styles.backdrop}></div>
        <img src={imgUrl} alt={title} />
        <div className={styles.Wrapper}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.stopPropagation();
          addToList(id);
          toast.success("Added to list");
        }}
        className={styles.button}
      >
        +
      </button>
    </div>
  );
}
