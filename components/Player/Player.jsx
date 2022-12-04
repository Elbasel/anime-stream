import React, { useEffect, useRef, useState } from "react";
import { Player as VimePlayer, DefaultUi, Hls } from "@vime/react";
import "@vime/core/themes/default.css";
import styles from "./Player.module.scss";
import forwardIcon from "./forward.png";
import replayIcon from "./replay.png";
import { Swipe as Swiper } from "node_modules/react-swipe-component/lib/index";

import {
  Controls,
  PlaybackControl,
  Control,
  Scrim,
  ScrubberControl,
  ControlSpacer,
  VolumeControl,
  SettingsControl,
  FullscreenControl,
  CurrentTime,
  EndTime,
  ControlGroup,
  TimeProgress,
  PipControl,
  CaptionControl,
  Tooltip,
} from "@vime/react";
import { getFromLocalStorage, saveToLocalStorage } from "util/localStorage";
export const Player = ({ url, title, episodeNumber, subtitles = [] }) => {
  const playerRef = useRef(null);

  const [swipeOffset, setSwipeOffset] = useState(0);

  const seek = (duration) => {
    //{duration} is in seconds
    playerRef.current.currentTime += duration;
    setTimeout(() => {
      playerRef.current.play()
    }, 500);
  };

  const onReady = () => {
    const savedTime = getFromLocalStorage(
      `${title}-${episodeNumber}-currentTime`
    );
    if (savedTime != null) {
      setTimeout(() => {
        playerRef.current.currentTime = +savedTime;
      }, 300);
    }
    playerRef.current.play();
    playerRef.current.volume = 100;
    playerRef.current.playbackQualities =
      playerRef.current.playbackQualities.filter((q) => !(q === "0p"));
    playerRef.current.playbackQuality = "360p";
  };

  // saved current player time to local storage
  const saveCurrentTime = () => {
    if (playerRef.current.currentTime == 0) return;
    saveToLocalStorage(
      `${title}-${episodeNumber}-currentTime`,
      playerRef.current.currentTime
    );
  };

  // save current time to local storage every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveCurrentTime();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // set subtitles to english automatically
  useEffect(() => {
    const interval = setInterval(() => {
      const tracks = playerRef?.current?.textTracks;
      setTimeout(() => {
        clearInterval(interval);
      }, 30000);

      if (tracks?.length !== 0) {
        clearInterval(interval);
        setTimeout(() => {
          tracks?.forEach((t, index, arr) => {
            console.log(t.label)
            if (t.label === "English") {
              console.log('english found')
              playerRef.current.setCurrentTextTrack(index);
              playerRef.current.setTextTrackVisibility(true);
            }
          });
        }, 5000);
      }
    }, 1000);
  }, []);

  const onSwipeStart = (p) => {
    if (!playerRef.current?.isFullscreenActive) return
    // console.log(p)
    const offset = p.x / window.innerWidth;
    console.log(Math.floor(100 * offset));
    // console.log(p.x)
    setSwipeOffset(offset);
  };

  const onSwipeEnd = () => {
    if (!playerRef.current?.isFullscreenActive) return
    setSwipeOffset(null);
    seek(30 * swipeOffset);
    console.log("end", swipeOffset);
  };

  const time = playerRef.current?.currentTime + Math.floor(30 * swipeOffset);
  const minutes = Math.floor(time / 60);
  const seconds = (time - minutes * 60 ).toFixed();

  return (
    <>
      <Swiper
        className={styles.swipeToSeek}
        detectMouse
        detectTouch={true}
        onSwipe={onSwipeStart}
        onSwipeEnd={onSwipeEnd}
      >
        <VimePlayer
          onVmReady={() => onReady(title, episodeNumber)}
          style={{ "--vm-settings-max-height": "200px" }}
          theme="dark"
          ref={playerRef}
          onVmFullscreenChange={() => playerRef.current.blur()}
        >
          <Hls crossOrigin="anonymous" version="latest">
            <source data-src={url} type="application/x-mpegURL" />
            {subtitles.map((s, i) => {
              return (
                <track
                  key={i}
                  kind="subtitles"
                  src={s.url}
                  label={s.lang}
                  srcLang="en"
                />
              );
            })}
          </Hls>
          <DefaultUi hideOnMouseLeave noControls>
            {/* Center Controls for play/pause and changing episode */}
            <Controls
              hideOnMouseLeave
              align="center"
              pin="center"
              justify="space-evenly"
              style={{
                "--vm-controls-spacing": "80px",
                "--vm-control-icon-size": "80px",
                // "margin-top": "-20px",
              }}
            >
              {+swipeOffset > 0 && playerRef.current?.isFullscreenActive &&(
                <div className={styles.swipeTime}>Jump to: {minutes}:{seconds}</div>
              )}
              <img
                className={styles.icon}
                src={replayIcon.src}
                onClick={() => seek(-5)}
              />

              <PlaybackControl hideOnMouseLeave hideTooltip keys="k/ " />
              <img
                className={styles.icon}
                src={forwardIcon.src}
                onClick={() => seek(5)}
              />
            </Controls>

            <Scrim gradient="up" hideOnMouseLeave />

            <Controls
              hideOnMouseLeave
              pin="bottomLeft"
              direction={"column-reverse"}
            >
              <ControlGroup hideOnMouseLeave space={"top"}>
                <PlaybackControl keys="k/ " tooltipDirection="right" />
                <VolumeControl />

                <TimeProgress />
                <ControlSpacer />
                <CaptionControl />
                <PipControl keys="i" />
                <SettingsControl />

                <FullscreenControl hideOnMouseLeave tooltipDirection="left" />
              </ControlGroup>

              <ControlGroup hideOnMouseLeave>
                <ScrubberControl />
              </ControlGroup>
            </Controls>
          </DefaultUi>
        </VimePlayer>
      </Swiper>
    </>
  );
};
