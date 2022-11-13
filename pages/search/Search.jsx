import styles from "./Search.module.scss";
import imgUrls from "./imgUrls.json";

import Link from "next/link";
export default function Search() {
    return (
        <div className={styles.container}>
            <div className={styles.option}>
                <img src={imgUrls.anime} alt="animeBg" />
                <button className="button-84">
                    <Link href="/search/anime">Anime</Link>
                </button>
            </div>
            <div className={styles.option}>
                <img src={imgUrls.movies} />
                <button className="button-84">
                    <Link href="./search/movies">Movies</Link>
                </button>
            </div>
        </div>
    );
}
