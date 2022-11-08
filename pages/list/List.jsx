import { ListAnimeCard } from "@components/ListAnimeCard";
import { Loader } from "@components/Loader";
import { ListContext } from "context/ListContext";
import React, { useContext, useEffect, useState } from "react";
import { fetchAll } from "util/fetchAnimeList";
import { getFromLocalStorage } from "util/localStorage";
import styles from "./List.module.scss";

export default function List() {
  const { list } = useContext(ListContext);
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getResults = async () => {
    setLoading(true);
    let fetchList = await fetchAll(list);
    setUserList(fetchList);
    setLoading(false);
  };

  useEffect(() => {
    getResults();
  }, []);

  useEffect(() => {
    setUserList((prevList) =>
      prevList.map((anime) => {
        const animeId =
          anime.episodesList[0].episodeId.match(/^.*?(?=-episode)/gm)[0];
        return list.includes(animeId)
          ? { ...anime, animatingUp: true }
          : { ...anime, animating: true };
      })
    );
    setTimeout(() => {
      setUserList((prevList) =>
        prevList.filter((anime) => {
          const animeId =
            anime.episodesList[0].episodeId.match(/^.*?(?=-episode)/gm)[0];
          return list.includes(animeId);
        })
      );
    }, 900);
  }, [list]);

  return (
    <div className={styles.container}>
      {loading && <Loader />}
      {userList.length === 0 && (
        <img src="data:image/png;base64,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" />
      )}
      {userList.map((anime) => {
        const animeId =
          anime.episodesList[0].episodeId.match(/^.*?(?=-episode)/gm)[0];
        let lastEpisodeWatched = parseInt(
          getFromLocalStorage(`episodeNum-${animeId}`)
        );

        if (isNaN(lastEpisodeWatched)) lastEpisodeWatched = 1;
        const newEpisode = lastEpisodeWatched < anime.episodesList.length;
        return (
          <ListAnimeCard
            key={animeId}
            title={anime.animeTitle}
            imgUrl={anime.animeImg}
            id={animeId}
            lastEpisodeWatched={lastEpisodeWatched}
            currentEpisode={anime.episodesList.length}
            newEpisode={newEpisode}
            animating={anime.animating}
            // animatingUp={anime.animatingUp}
          />
        );
      })}
    </div>
  );
}
