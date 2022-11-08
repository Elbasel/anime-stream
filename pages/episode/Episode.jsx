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
  const [episodeNumber, setEpisodeNumber] = useState(null);
  const [animeTitle, setAnimeTitle] = useState("");

  const getStreamingUrl = (id, episodeNumber) => {
    const fetchURl = `https://gogoanime.consumet.org/vidcdn/watch/${id}-episode-${episodeNumber}`;
    fetch(fetchURl)
      .then((response) => response.json())
      .then((animelist) => {
        setStreamingUrl(animelist?.sources_bk?.[0].file);
      });
  };

  const getAnimeDetails = (id) => {
    fetch(`https://gogoanime.consumet.org/anime-details/${id}`)
      .then((response) => response.json())
      .then((animelist) => {
        setEpisodes(animelist?.episodesList);
        setAnimeTitle(animelist?.animeTitle);
      });
  };

  useEffect(() => {
    if (id == null || episodeNumber == null) return;

    getStreamingUrl(id, episodeNumber);
  }, [id, episodeNumber]);

  useEffect(() => {
    if (id == null) return;

    getAnimeDetails(id);
  }, [id]);

  useEffect(() => {
    if (id == null) return;

    const savedEpisode = getFromLocalStorage(`episodeNum-${id}`);
    if (savedEpisode != null) {
      setEpisodeNumber(savedEpisode);
    } else {
      setEpisodeNumber(1);
    }
  }, [id]);

  useEffect(() => {
    if (id == null || episodeNumber == null) return;
    saveToLocalStorage(`episodeNum-${id}`, episodeNumber);
  }, [episodeNumber]);

  if (!streamingUrl) return <Loader />;
  console.log({ episodeNumber });
  console.log(streamingUrl);
  return (
    <div className={styles.Episode}>
      {animeTitle != "" && <h1>{animeTitle}</h1>}
      <div className={styles.playerWrapper}>
        <Player url={streamingUrl} />
      </div>
      {episodes && (
        <div className={styles.episodeControls}>
          <BsChevronBarLeft
            onClick={() =>
              setEpisodeNumber((prevEpisode) =>
                prevEpisode - 1 > 0 ? prevEpisode - 1 : prevEpisode
              )
            }
          />
          <Select
            options={[...episodes].reverse().map((ep) => +ep.episodeNum)}
            name="EpisodeNum"
            value={episodeNumber}
            onValueChange={(newValue) => setEpisodeNumber(+newValue)}
          />
          <BsChevronBarRight
            onClick={() =>
              setEpisodeNumber((prevEpisode) =>
                prevEpisode + 1 <= episodes.length
                  ? prevEpisode + 1
                  : prevEpisode
              )
            }
          />
        </div>
      )}
    </div>
  );
}
