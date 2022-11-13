import { Card } from '@components/Card'
import useLocalStorage from 'hooks/useLocalStorage';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useState } from 'react'
import styles from './MovieSearch.module.scss'

export default function MovieSearch() {

    const [searchResults, setSearchResults] = useState([])
    const [searchValue, setSearchValue] = useLocalStorage("movieSearchValue", "");
    const [searchFocused, setSearchFocused] = useState(false);

    const [loading, setLoading] = useState(false);




    const getResults = useCallback(
        debounce((keyword) => {
            if (keyword == "") return;
            setLoading(true);
            const fetchUrl = `https://api.consumet.org/movies/flixhq/${keyword}`;
            fetch(fetchUrl)
                .then((response) => response.json())
                .then((movieList) => {
                    setSearchFocused(true);
                    setSearchResults(movieList.results);
                    document.documentElement.scrollTop = 0;
                    setLoading(false);
                });
        }, 500),
        []
    );


    useEffect(() => {
        getResults(searchValue);
    }, [searchValue]);

    return (
        <div>
            <div className={styles.searchBarContainer}>

                <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
                    className={styles.searchBar} type="search" name="search" id="search" /></div>
            <div className={styles.Cards}>
                {searchResults.map(result => (
                    <Card
                        key={result.id}
                        id={result.id}
                        title={result.title}
                        imgUrl={result.image}
                        type="movie"
                    />
                ))}
            </div>
        </div>
    )
}
