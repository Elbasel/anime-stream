import Link from "next/link";
import React, { useContext, useState } from "react";
import styles from "./ListAnimeCard.module.scss";
import { HiBellAlert } from "react-icons/hi2";
import { BsFillTrashFill } from "react-icons/bs";
import { Swipe } from "@components/Swipe";
import { ListContext } from "context/ListContext";

export function ListAnimeCard({
  imgUrl,
  title,
  id,
  lastEpisodeWatched,
  currentEpisode,
  newEpisode,
  animating,
  animatingUp,
}) {
  return (
    // <Card
    //   imgUrl={imgUrl}
    //   title={title}
    //   id={id}
    //   lastEpisodeWatched={lastEpisodeWatched}
    //   currentEpisode={currentEpisode}
    //   newEpisode={newEpisode}
    //   animating={animating}
    // />
    <Swipe
      className={`${animating ? styles.animating : ""}`}
      MainElem={() => (
        <Card
          imgUrl={imgUrl}
          title={title}
          id={id}
          lastEpisodeWatched={lastEpisodeWatched}
          currentEpisode={currentEpisode}
          newEpisode={newEpisode}
          animating={animating}
        />
      )}
      HiddenElem={() => <Options id={id} />}
    />
  );
}

const Card = ({
  imgUrl,
  title,
  id,
  lastEpisodeWatched,
  currentEpisode,
  newEpisode,
  animating,
}) => {
  const [mouseStart, setMouseStart] = useState(null);
  const [xDistance, setXDistance] = useState(0);
  console.log("render");
  return (
    <Link
      // prevent click event in case user swipes on card
      onClick={(e) => (xDistance > 10 ? e.preventDefault() : null)}
      onMouseDown={(e) => setMouseStart(e.clientX)}
      onMouseUp={(e) => setXDistance(Math.abs(mouseStart - e.clientX))}
      href={`./episode/${id}`}
      className={`${styles.Card} ${newEpisode ? styles.New : ""} `}
    >
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
};

const Options = ({ id }) => {
  const { removeFromList } = useContext(ListContext);
  return (
    <div className={styles.Options}>
      <div className={styles.OptionsNotifications}>
        <HiBellAlert />
        <h4>Notifications</h4>
      </div>

      <div className={styles.OptionsRemove} onClick={() => removeFromList(id)}>
        <BsFillTrashFill />
        <h4>Remove</h4>
      </div>
    </div>
  );
};
