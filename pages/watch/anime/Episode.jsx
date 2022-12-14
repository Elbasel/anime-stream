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
  const [loading, setLoading] = useState(true)

  const getStreamingUrl = (id, episodeNumber, episodes) => {
    setLoading(true)

    setStreamingUrl(null);
    const actualEpisodeNumber = [...episodes]
      .reverse()
    [episodeNumber - 1].episodeUrl.match(/(?<=\-episode-).*/gm)[0];
    // console.log({ actualEpisodeNumber });
    const fetchURl = `https://gogoanime.consumet.org/vidcdn/watch/${id}-episode-${actualEpisodeNumber}`;
    // const fetchURl = `https://gogoanime.consumet.org/vidcdn/watch/${id}-episode-${episodeNumber}`;
    // console.log({ fetchURl });
    fetch(fetchURl)
      .then((response) => response.json())
      .then((animelist) => {
        setStreamingUrl(animelist?.sources_bk?.[0].file);
      });
      setLoading(false)
  };

  const getAnimeDetails = (id) => {
    setLoading(true)
    fetch(`https://gogoanime.consumet.org/anime-details/${id}`)
    .then((response) => response.json())
    .then((animelist) => {
      // console.log({ 'fetched LIst inside episode.jsx: ': animelist })
      setEpisodes(animelist?.episodesList);
      // console.log({ animelist });
      setAnimeTitle(animelist?.animeTitle);
      setLoading(false)
      });
  };

  useEffect(() => {
    if (id == null || episodeNumber == null || episodes.length === 0) return;

    getStreamingUrl(id, episodeNumber, episodes);
  }, [id, episodeNumber, episodes]);

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




  if (loading) return <Loader />;
  return (
    <div className={styles.Episode}>
      {animeTitle != "" && <h1>{animeTitle}</h1>}
      <div className={styles.playerWrapper}>
        {streamingUrl && episodes?.length > 0 ? <Player url={streamingUrl} title={animeTitle} episodeNumber={episodeNumber} /> : episodes.length === 0 ? <div className={styles.errorMessage + ' linear-text'}>Not Yet Aired</div> : <Loader />}
      </div>
      {episodes?.length > 0 ? (
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
      ) : <div className={styles.errorMessage + ' push-up-2'} >No Episodes yet</div>}
    </div>
  );
}
