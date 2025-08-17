"use client";
import useAudioStore from "@/lib/store";
import { CirclePause, CirclePlay } from "lucide-react";
import { Episode } from "../EpisodeCard";

const PlayButton = ({ episode, big }: { episode: Episode; big: boolean }) => {
  const { setCurrentTrack, currentTrack, updateLastPlays } = useAudioStore();
  const iconSize = big ? "w-16 h-16" : "w-6 h-6"; // Tailwind classes for 100px (24 * 4px)

  return (
    <button
      onClick={() => {
        if (currentTrack?.url !== episode.previewUrl) {
          setCurrentTrack({
            url: episode.previewUrl || episode.previewUrl,
            title: episode.title,
            length: episode.duration ? parseInt(episode.duration) : 0,
            artist: episode.podcast,
          });
          updateLastPlays?.(episode);
        } else {
          setCurrentTrack(undefined);
        }
      }}
      className="px-4 py-2 rounded-lg transition-colors cursor-pointer"
    >
      <CirclePlay
        className={`text-white ${iconSize} ${currentTrack?.url === episode?.previewUrl ? "hidden" : "block"}`}
      />
      <CirclePause
        className={`text-white ${iconSize} ${currentTrack?.url !== episode?.previewUrl ? "hidden" : "block"}`}
      />
    </button>
  );
};

export default PlayButton;
