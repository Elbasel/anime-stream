import useLocalStorage from "hooks/useLocalStorage";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BsChevronBarRight, BsChevronBarLeft } from "react-icons/bs";
import styles from "./Episode.module.scss";
import { Select } from "@components/Input/Select";
import { Loader } from "@components/Loader";
import { getFromLocalStorage, saveToLocalStorage } from "util/localStorage";

const Player = dynamic(
  () => import("components/Player").then((mod) => mod.Player),
  {
    ssr: false,
  }
);
export default function Episode() {
  const router = useRouter();
  const { id } = router.query;

  const [streamingUrl, setStreamingUrl] = useState("");
  const [episodes, setEpisodes] = useState([]);
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [animeTitle, setAnimeTitle] = useState("");

  const getStreamingUrl = (id) => {
    if (id == null) return;
    const fetchURl = `https://gogoanime.consumet.org/vidcdn/watch/${id}-episode-${episodeNumber}`;
    // console.log(fetchURl);
    fetch(fetchURl)
      .then((response) => response.json())
      .then((animelist) => {
        setStreamingUrl(animelist?.sources_bk?.[0].file);
        // console.log(animelist);
      });
  };

  const getAnimeDetails = (id) => {
    if (id == null) return;
    // console.log("details id: ", id);
    fetch(`https://gogoanime.consumet.org/anime-details/${id}`)
      .then((response) => response.json())
      .then((animelist) => {
        setEpisodes(animelist?.episodesList);
        // console.log(animelist);
        setAnimeTitle(animelist?.animeTitle);
      });
  };

  useEffect(() => {
    getStreamingUrl(id);
  }, [id, episodeNumber]);

  useEffect(() => {
    getAnimeDetails(id);
  }, [id]);

  useEffect(() => {
    if (id == null) return;

    const savedEpisode = getFromLocalStorage(`episodeNum-${id}`);
    if (savedEpisode != null) {
      setEpisodeNumber(savedEpisode);
    }
  }, [id]);

  useEffect(() => {
    if (id == null) return;
    saveToLocalStorage(`episodeNum-${id}`, episodeNumber);
  }, [episodeNumber]);

  if (!streamingUrl || !animeTitle || episodes.length === 0) return <Loader />;
  return (
    <div className={styles.Episode}>
      {animeTitle != "" && <h1>{animeTitle}</h1>}
      <div className={styles.playerWrapper}>
        <Player url={streamingUrl} />
      </div>
      {episodes && (
        <div className={styles.episodeControls}>
          <BsChevronBarLeft
            onClick={() => setEpisodeNumber((prevEpisode) => prevEpisode + 1)}
          />
          <Select
            options={[...episodes].reverse().map((ep) => +ep.episodeNum)}
            name="EpisodeNum"
            value={episodeNumber}
            onValueChange={(newValue) => setEpisodeNumber(+newValue)}
          />
          <BsChevronBarRight />
        </div>
      )}
    </div>
  );
}
