import { fetchAll } from "./fetchAnimeList";
import { getFromLocalStorage } from "./localStorage";

export async function getNewEpisodeCount(animeIds) {

    let counter = 0

    let fetchList = await fetchAll(animeIds);

    fetchList.forEach(anime => {
        const animeId =
            anime.episodesList[0].episodeId.match(/^.*?(?=-episode)/gm)[0];
        const lastEpisodeWatched = parseInt(
            getFromLocalStorage(`episodeNum-${animeId}`)
        );
        const newEpisode = lastEpisodeWatched < anime.episodesList.length;
        if (newEpisode) counter++
    })
    // debugger
    return counter

}