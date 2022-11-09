import React, { useEffect, useRef, useState } from "react";
import { Player as VimePlayer, DefaultUi, Hls } from "@vime/react";
import "@vime/core/themes/default.css";
import styles from "./Player.module.scss";
import SkipIcon from "./skip.png";

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
export const Player = ({ url }) => {
  const playerRef = useRef(null);

  const seek = (duration) => {
    playerRef.current.currentTime += duration;
  };

  const setTime = () => {
    console.log("setting");
    const savedTime = +getFromLocalStorage(url);
    if (savedTime != null) {
      playerRef.current.currentTime = savedTime;
    }
  };

  useEffect(() => {
    let localRef = null;
    let localUrl = null;
    if (playerRef.current) localRef = playerRef.current;
    if (url) localUrl = url;
    return () => {
      if (localRef.currentTime === 0) return;
      console.log({ time: localRef.currentTime });
      saveToLocalStorage(localUrl, localRef.currentTime);
    };
  }, []);
  return (
    <VimePlayer
      onVmReady={() => setTime()}
      style={{ "--vm-settings-max-height": "200px" }}
      theme="dark"
      ref={playerRef}
    >
      <Hls version="latest">
        <source data-src={url} type="application/x-mpegURL" />
      </Hls>
      <DefaultUi noControls>
        {/* Center Controls for play/pause and changing episode */}
        <Controls
          align="center"
          pin="center"
          justify="space-evenly"
          style={{
            "--vm-controls-spacing": "80px",
          }}
        >
          <img
            className={styles.icon}
            src={SkipIcon.src}
            onClick={() => seek(-5)}
          />

          <PlaybackControl hideTooltip keys="k/ " />
          <img
            className={styles.icon}
            src={SkipIcon.src}
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
            <SettingsControl />

            <FullscreenControl tooltipDirection="left" />
          </ControlGroup>

          <ControlGroup>
            <ScrubberControl />
          </ControlGroup>
        </Controls>
      </DefaultUi>
    </VimePlayer>
  );
};
