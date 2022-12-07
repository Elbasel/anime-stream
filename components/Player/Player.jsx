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
  const containerRef = useRef(null);
  const settingsControlRef = useRef(null);

  const swipeMultiplier = 60;

  const [swipeOffset, setSwipeOffset] = useState(null);
  const [ready, setReady] = useState(false);
  const [controlsShown, setControlsShown] = useState(true);

  const seek = (duration) => {
    //<duration> is in seconds
    playerRef.current.currentTime += duration;
    setTimeout(() => {
      playerRef.current.play();
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
    setReady(true);
    setSubtitles();

    const toggleControls = (e) => {
      console.log("clicked");
      console.log(e.target.tagName);
      const clickedTagName = e.target.tagName
      const tagNames = [
        "VM-PLAYBACK-CONTROL",
        "VM-VOLUME-CONTROL",
        "VM-FULLSCREEN-CONTROL",
        "VM-SETTINGS-CONTROL",
        "IMG",
        "VM-PIP-CONTROL",
        
      ];
      if (tagNames.includes(clickedTagName.trim())) return
      setControlsShown((prev) => !prev);
    };

    containerRef.current.addEventListener("click", toggleControls);
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
  const setSubtitles = (lang = "English") => {
    const interval = setInterval(() => {
      const tracks = playerRef?.current?.textTracks;
      setTimeout(() => {
        clearInterval(interval);
      }, 30000);

      if (tracks?.length !== 0) {
        clearInterval(interval);
        setTimeout(() => {
          tracks?.forEach((t, index, arr) => {
            console.log(t.label);
            if (t.label.toLowerCase().includes(lang.toLowerCase())) {
              console.log(playerRef.current.textTracks);
              console.log({ index });
              playerRef.current.setCurrentTextTrack(t.id);
              playerRef.current.setTextTrackVisibility(true);
            }
          });
        }, 5000);
      }
    }, 1000);
  };

  const onSwipeStart = (p) => {
    if (!playerRef.current?.isFullscreenActive || Math.abs(p.x) < 5) return;
    const offset = p.x / window.innerWidth;
    setSwipeOffset(offset);
  };

  const onSwipeEnd = () => {
    if (!playerRef.current?.isFullscreenActive || !swipeOffset) return;
    seek(swipeMultiplier * swipeOffset);
    setSwipeOffset(null);
  };

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 3100);
  }, []);

  // fix issue when controls stay shown after going fullscreen on mobile
  const onFullScreenChange = () => {
    if (!playerRef.current.isFullscreenActive) return;
    setTimeout(() => {
      setControlsShown(false);
    }, 1000);

    // setTimeout(() => {
    //   setControlsShown(true);
    // }, 1100);
  };
  const time =
    playerRef.current?.currentTime + Math.floor(swipeMultiplier * swipeOffset);

  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = ((time % 3600) % 60).toFixed().padStart(2, 0);

  if (!subtitles) return;

  const UiProps = controlsShown ? {} : { hidden: true };
  return (
    <div ref={containerRef}>
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
          onVmFullscreenChange={onFullScreenChange}
        >
          <Hls crossOrigin="anonymous" version="latest">
            <source data-src={url} type="application/x-mpegURL" />
            {subtitles &&
              ready &&
              subtitles.map((s, i) => {
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

          {/* {controlsShown && ( */}
          <DefaultUi {...UiProps} noControls>
            {swipeOffset && playerRef.current?.isFullscreenActive && (
              <div className={styles.swipeTime}>
                Jump to {h > 0 && h + ":"}
                {m}:{s}
              </div>
            )}
            {/* Center Controls for play/pause and changing episode */}
            <Controls
              activeDuration={2000}
              align="center"
              pin="center"
              justify="space-evenly"
              style={{
                "--vm-controls-spacing": "80px",
                "--vm-control-icon-size": "80px",
                // "margin-top": "-20px",
              }}
            >
              <img
                className={styles.icon}
                src={replayIcon.src}
                onClick={() => seek(-5)}
              />

              <PlaybackControl hideTooltip keys="k/ " />
              <img
                className={styles.icon}
                src={forwardIcon.src}
                onClick={() => seek(5)}
              />
            </Controls>

            <Scrim gradient="up" />

            <Controls pin="bottomLeft" direction={"column-reverse"}>
              <ControlGroup space={"top"}>
                <PlaybackControl keys="k/ " tooltipDirection="right" />
                <VolumeControl />

                <TimeProgress />
                <ControlSpacer />
                <CaptionControl />
                <PipControl keys="i" />
                <SettingsControl ref={settingsControlRef} />

                <FullscreenControl tooltipDirection="left" />
              </ControlGroup>

              <ControlGroup>
                <ScrubberControl />
              </ControlGroup>
            </Controls>
          </DefaultUi>
          {/* )} */}
        </VimePlayer>
      </Swiper>
    </div>
  );
};
