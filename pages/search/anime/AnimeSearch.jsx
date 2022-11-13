import { Loader } from "@components/Loader";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Card } from "@components/Card";
import styles from "./AnimeSearch.module.scss";
import { Radio } from "@components/Input/Radio";
import useLocalStorage from "hooks/useLocalStorage";

export default function AnimeSearch() {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dub, setDub] = useLocalStorage("Dub", false);

  const getResults = useCallback(
    debounce((keyword, dub) => {
      if (keyword == "") return;
      setLoading(true);
      const fetchUrl = `https://gogoanime.consumet.org/search?keyw=${keyword}`;
      fetch(fetchUrl)
        .then((response) => response.json())
        .then((animelist) => {
          setSearchFocused(true);

          if (dub) {
            animelist = animelist.filter((r) =>
              r.animeTitle.toLowerCase().includes("dub")
            );
            animelist = animelist.map((r) => ({
              ...r,
              animeTitle: r.animeTitle.replace("(Dub)", ""),
            }));
          } else {
            animelist = animelist.filter(
              (r) => !r.animeTitle.toLowerCase().includes("dub")
            );
          }
          setSearchResults(animelist);
          document.documentElement.scrollTop = 0;
          setLoading(false);
        });
    }, 500),
    []
  );

  useEffect(() => {
    getResults(searchValue, dub);
  }, [searchValue, dub]);

  return (
    <div className={styles.Search}>
      <div className={styles.filtersWrapper}></div>
      <div className={styles.inputWrapper}>
        <input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          type="search"
          name="search"
          id="search"
        />
        <Radio
          options={["Sub", "Dub"]}
          value={dub ? "Dub" : "Sub"}
          onValueChange={(newValue) => setDub(newValue === "Dub")}
        />
      </div>
      {loading && <Loader />}
      {searchResults.length === 0 && searchFocused && (
        <h1 className="paddingSm">
          No Results Found, try changing search term
        </h1>
      )}

      <div className={styles.Cards}>
        {!loading &&
          searchResults.map((result) => (
            <Card
              key={result.animeId}
              id={result.animeId}
              title={result.animeTitle}
              imgUrl={result.animeImg}
            />
          ))}
      </div>
    </div>
  );
}
