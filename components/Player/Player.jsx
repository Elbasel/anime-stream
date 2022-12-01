import React, { useEffect, useRef, useState } from "react";
import { Player as VimePlayer, DefaultUi, Hls } from "@vime/react";
import "@vime/core/themes/default.css";
import styles from "./Player.module.scss";
import forwardIcon from "./forward.png";
import replayIcon from './replay.png';

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

  const seek = (duration) => {
    playerRef.current.currentTime += duration;
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
    playerRef.current.playbackQualities = playerRef.current.playbackQualities.filter(q => !(q === '0p'))
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
      saveCurrentTime()
    }, 5000);

    return () => {clearInterval(interval)}
  }, [])



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
          tracks?.forEach((t, index) => {
            if (t.label === "English") {
              playerRef?.current?.setCurrentTextTrack(index);
              playerRef.current.setTextTrackVisibility(true);

            }
          });
        }, 5000);
      }
    }, 1000);
  }, []);



  return (
    <VimePlayer
      onVmReady={() => onReady(title, episodeNumber)}
      style={{ "--vm-settings-max-height": "200px" }}
      theme="dark"
      ref={playerRef}
      onVmFullscreenChange={() => playerRef.current.blur()}
    >
      <Hls crossOrigin="anonymous" version="latest">
        <source data-src={url} type="application/x-mpegURL" />
        {subtitles.map((s) => {
          if (s.lang === "Default (Maybe)") return null;
          return (
            <track
              key={s.lang}
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
            '--vm-control-icon-size': '80px',
            'margin-top': '-20px',
          }}
        >
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
  );
};
