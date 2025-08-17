"use client";

import useAudioStore from "@/lib/store";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, VolumeX, Volume2, RotateCcw, RotateCw, Download } from "lucide-react";
import getTime from "@/lib/getTime";

// from milliseconds to hours:minutes:seconds format
const formatTime = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours > 0 ? `${hours}:` : ""}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};
const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentTrack, isPlaying } = useAudioStore();
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerCont = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }, [currentTrack]);

  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        console.log("Current Time:", audioRef.current.currentTime);
        setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100 || 0);
      }
    };

    const audio = audioRef.current;
    if (audio) audio.addEventListener("timeupdate", updateProgress);

    return () => {
      if (audio) {
        audio.removeEventListener("timeupdate", updateProgress);
      }
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const rewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
    }
  };

  const forward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(audioRef.current.duration, audioRef.current.currentTime + 10);
    }
  };

  useEffect(() => {
    if (currentTrack) {
      setDuration(currentTrack.length ? currentTrack.length : 0);
      document.body.style.paddingBottom = playerCont.current?.offsetHeight + "px";
    } else {
      document.body.style.paddingBottom = "0";
    }
  }, [currentTrack]);

  return (
    <div
      ref={playerCont}
      className="fixed bottom-0 left-0 flex z-10 items-center justify-between flex-col right-0 px-4 py-5 bg-200 text-white shadow-lg"
      style={{
        display: currentTrack ? "flex" : "none",
      }}
    >
      {/* Track Info */}
      <div className="flex items-start w-full justify-between">
        <div>
          <div className="text-lg font-bold">{currentTrack?.title}</div>
          <div className="text-sm text-gray-400">{currentTrack?.artist}</div>
        </div>

        <div className="flex items-center gap-3 text-gray-500 text-xs">
          {currentTrack?.length && (
            <>
              <span>•</span>
              <span>{getTime(currentTrack.length)}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 justify-between w-full">
        <a href={currentTrack?.url} download className="text-xl" target="_blank" rel="noopener noreferrer">
          {/* Download Icon */}
          <Download />
        </a>
        {/* Mute/Unmute Button */}
        <button className="text-xl" onClick={toggleMute}>
          {isMuted ? <VolumeX /> : <Volume2 />}
        </button>

        {/* Timeline */}
        <div className="flex-1 mx-4">
          <div className="flex justify-between text-xs text-gray-400">
            <span> {formatTime(currentTime * 1000)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <input
            type="range"
            value={progress}
            onChange={(e) => {
              if (audioRef.current) {
                const newTime = (parseFloat((e.target as HTMLInputElement).value) / 100) * audioRef.current.duration;
                audioRef.current.currentTime = newTime;
                setProgress((newTime / audioRef.current.duration) * 100 || 0);
              }
            }}
            onInput={(e) => {
              if (audioRef.current) {
                const newTime = (parseFloat((e.target as HTMLInputElement).value) / 100) * audioRef.current.duration;
                setProgress((newTime / audioRef.current.duration) * 100 || 0);
              }
            }}
            className="w-full h-1 bg-pink-400 rounded-lg appearance-none cursor-pointer"
            style={{
              direction: "ltr",
            }}
          />
        </div>

        <div className="flex gap-2">
          {/* Forward Button */}
          <button className="text-sm" onClick={forward}>
            <RotateCw size={20} />
          </button>
          {/* Play/Pause Button */}
          <button
            className="text-xl"
            onClick={() => {
              useAudioStore.setState({ isPlaying: !isPlaying });
              if (audioRef.current) {
                if (audioRef.current.paused) {
                  audioRef.current.play();
                } else {
                  audioRef.current.pause();
                }
              }
            }}
          >
            {isPlaying ? <Pause size={30} /> : <Play size={30} />}
          </button>
          {/* Rewind Button */}
          <button className="text-sm" onClick={rewind}>
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={currentTrack?.url} preload="metadata" controls style={{ display: "none" }} />
    </div>
  );
};

export default AudioPlayer;
