import React, { useRef, useState } from "react";
import { Player as VimePlayer, DefaultUi, Hls } from "@vime/react";
import "@vime/core/themes/default.css";
import styles from "./Player.module.scss";

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
export const Player = ({ url }) => {
  const playerRef = useRef(null);

  return (
    <VimePlayer
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
          {/* <Control
            onClick={}
            keys="p"
            label="Previous Episode"
          >
            <ChevronDoubleLeftIcon style={{ width: "10px", color: "white" }} />
            <Tooltip>previous(p)</Tooltip>
          </Control> */}

          <PlaybackControl hideTooltip keys="k/ " />

          {/* <Control
            onClick={() => dispatch(incrementEpisode())}
            keys="n"
            label="Next Episode"
          >
            <ChevronDoubleRightIcon className="w-9 text-white" />
            <Tooltip className="text-xs">next(n)</Tooltip>
          </Control> */}
        </Controls>

        {/* Default Controls */}
        <Scrim gradient="up" />

        {/* {isMobile && ( */}
        <Controls pin="topLeft">
          <ControlSpacer />
          <VolumeControl />
          <SettingsControl />
        </Controls>
        {/* )} */}

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
