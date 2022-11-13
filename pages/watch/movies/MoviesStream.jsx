import { Loader } from '@components/Loader'
import Picker from '@components/Picker'
import { Player } from '@components/Player'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { getFromLocalStorage, saveToLocalStorage } from 'util/localStorage'
import styles from './MoviesStream.module.scss'


const streamUrl = "https://api.consumet.org/movies/flixhq/watch?"
const infoUrl = "https://api.consumet.org/movies/flixhq/info?"

export default function MoviesStream() {

    const { id, title } = useRouter().query

    const [episodeList, setEpisodeList] = useState(null)
    const [currentEpisode, setCurrentEpisode] = useState(null)
    const [streamingUrl, setStreamingUrl] = useState(null)


    const getEpisodeList = async (id) => {
        const response = await fetch(infoUrl + new URLSearchParams({ id }))
        const episodes = await response.json()
        setEpisodeList(episodes.episodes)
    }


    const getStreamingUrl = async (episodeId, mediaId) => {
        const response = await fetch(streamUrl + new URLSearchParams({ episodeId, mediaId }))
        const result = await response.json()
        console.log({ result })
        setStreamingUrl(result.sources.at(-1).url)
        console.log({ url: result.sources.at(-1).url })
    }

    useEffect(() => {
        if (id == null) return
        getEpisodeList(id)
        const savedEpisode = getFromLocalStorage(`${id}-episodeNum`)
        if (savedEpisode != null) {
            setCurrentEpisode(savedEpisode)
        }
    }, [id])

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
                {streamingUrl && <Player url={streamingUrl} />}
            </div>
            {/* <div className={styles.seasonsContainer}> */}
            {/* <div>Season One</div> */}
            {/* <div>Season Two</div> */}
            {/* </div> */}
            <div className={styles.pickerContainer}>
                {episodeList ? <Picker options={episodeList} selectedValue={currentEpisode} onValueChange={(newValue) => setCurrentEpisode(newValue)} /> : <Loader />
                }
            </div>
        </div>
    )
}
