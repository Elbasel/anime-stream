import { Loader } from '@components/Loader'
import Picker from '@components/Picker'
import { useFileSystemPublicRoutes } from 'next.config'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import styles from './MoviesStream.module.scss'


const streamUrl = "https://api.consumet.org/movies/flixhq/watch?"
const infoUrl = "https://api.consumet.org/movies/flixhq/info?"

export default function MoviesStream() {

    const { id, title } = useRouter().query

    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisode, setCurrentEpisode] = useState(null)


    const getEpisodeList = async (id) => {
        const response = await fetch(infoUrl + new URLSearchParams({ id }))
        const episodes = await response.json()
        setEpisodeList(episodes.episodes)
    }


    const getStreamingUrl = async (episodeId, mediaId) => {
        const response = await fetch(streamUrl + new URLSearchParams({ episodeId, mediaId }))
        const streamingUrls = await response.json()
        console.log({ streamingUrls })
    }

    useEffect(() => {
        if (id == null) return
        getEpisodeList(id)
    }, [id])

    useEffect(() => {
        if (episodeList == null || id == null) return

        getStreamingUrl(currentEpisode, id)
    }, [currentEpisode])

    if (id === undefined) return <Loader />
    return (
        <div>
            <h1 className={styles.title}>{title}</h1>
            <div className={styles.playerContainer}></div>
            {/* <div className={styles.seasonsContainer}> */}
            {/* <div>Season One</div> */}
            {/* <div>Season Two</div> */}
            {/* </div> */}
            <div className={styles.pickerContainer}>
                <Picker options={episodeList} selectedValue={currentEpisode} onValueChange={(newValue) => setCurrentEpisode(newValue)} />
            </div>
        </div>
    )
}
