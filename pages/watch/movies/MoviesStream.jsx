import { Loader } from '@components/Loader'
import Picker from '@components/Picker'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getFromLocalStorage, saveToLocalStorage } from 'util/localStorage'
import styles from './MoviesStream.module.scss'

const Player = dynamic(
    () => import("components/Player").then((mod) => mod.Player),
    {
        ssr: false,
    }
);


const streamUrl = "https://api.consumet.org/movies/flixhq/watch?"
const infoUrl = "https://api.consumet.org/movies/flixhq/info?"

export default function MoviesStream() {

    const { id, title } = useRouter().query

    const [episodeList, setEpisodeList] = useState(null)
    const [currentEpisode, setCurrentEpisode] = useState(null)
    const [streamingUrl, setStreamingUrl] = useState(null)
    const [subtitles, setSubtitles] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)


    const getEpisodeList = async (id) => {
        const response = await fetch(infoUrl + new URLSearchParams({ id }))
        const episodes = await response.json()
        setEpisodeList(episodes.episodes)
    }


    const getStreamingUrl = async (episodeId, mediaId) => {
        setLoading(true)
        setStreamingUrl(null)
        setSubtitles(null)

        const response = await fetch(streamUrl + new URLSearchParams({ episodeId, mediaId }))
        const result = await response.json()
        if (!(result?.sources)) {
            setError('Error fetching')
            return
        }

        setStreamingUrl(result.sources.at(-1).url)
        setSubtitles(result.subtitles)
        setError(null)
        setTimeout(() => {
            setLoading(false)
        }, 1000);
    }

    // get episode list on first render
    useEffect(() => {
        if (id == null) return
        getEpisodeList(id)

    }, [id])

    // set current episode if found in local storage
    useEffect(() => {
        if (episodeList == null) return
        const savedEpisode = getFromLocalStorage(`${id}-episodeNum`)
        if (savedEpisode != null) {
            setCurrentEpisode(savedEpisode)
        }
        else {
            setCurrentEpisode(episodeList.at(0).id)
        }
    }, [episodeList])


    // user changes episode: save current episode to local storage and get new streaming url
    useEffect(() => {
        if (currentEpisode == null || id == null) return
        saveToLocalStorage(`${id}-episodeNum`, currentEpisode)
        getStreamingUrl(currentEpisode, id)
    }, [currentEpisode])



    if (id === undefined) return <Loader />
    return (
        <div>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.playerContainer}>
                {error && <div className={styles.error}>{error}, <button onClick={() => window.location.reload(true)}>try again</button></div>}
                {!loading && streamingUrl && <Player title={title} episodeNumber={currentEpisode} url={streamingUrl} subtitles={subtitles} />}
                {loading && !error && <div className={styles.playerLoading}><Loader /></div>}
            </div>
            {/* <div className={styles.seasonsContainer}> */}
            {/* <div>Season One</div> */}
            {/* <div>Season Two</div> */}
            {/* </div> */}
            <div className={styles.pickerContainer}>
                {episodeList ? <Picker options={episodeList} selectedValue={currentEpisode} onValueChange={(newValue) => setCurrentEpisode(newValue)} /> : <Loader />
                }
            </div>
        </div >
    )
}
