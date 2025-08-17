import { CirclePause, CirclePlay } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MenuClick from "../MenuClick";
import getTime from "@/lib/getTime";
import useAudioStore from "@/lib/store";
import { generateLink } from "@/utils/generateLinks";

export type Episode = {
  id: string;
  title: string;
  podcast: string;
  image: string;
  description?: string;
  date: string;
  duration?: string;
  podcastId: string;
  offset?: number; // Optional, used for pagination
  previewUrl: string; // Optional, used for previews
};
const EpisodeCard = ({
  episode,
  isGrid,
  isScroll,
  isCompact,
  offset,
  showLinkToPodcast,
}: {
  episode: Episode;
  isGrid?: boolean;
  isScroll?: boolean;
  isCompact?: boolean;
  offset?: number;
  showLinkToPodcast?: boolean;
}) => {
  const { setCurrentTrack, currentTrack, updateLastPlays } = useAudioStore();

  return (
    <div
      className={`flex gap-2 lg:gap-4  hover:bg-200 rounded-lg transition-colors group  items-start flex-nowrap ${
        isScroll && "w-fit "
      }`}
    >
      <div
        className={`rounded-lg ${
          isCompact ? "size-15 sm:size-20" : "size-25 sm:size-30"
        }  flex-shrink-0 flex items-center justify-center relative overflow-hidden group`}
      >
        <Image
          src={episode.image}
          alt={episode.title}
          width={isCompact ? 100 : 150}
          height={isCompact ? 100 : 150}
          className="rounded-lg object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/70 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity">
          {currentTrack?.url !== episode.previewUrl ? (
            <CirclePlay
              onClick={() => {
                if (episode.previewUrl || episode.previewUrl)
                  setCurrentTrack({
                    url: episode.previewUrl || episode.previewUrl,
                    title: episode.title,
                    length: episode.duration ? parseInt(episode.duration) : 0,
                    artist: episode.podcast,
                  });
                updateLastPlays?.(episode);
              }}
              className="size-12 text-white hover:text-pink-400 transition-colors"
            />
          ) : (
            <CirclePause
              onClick={() => {
                setCurrentTrack(undefined);
              }}
              className="size-12 text-white hover:text-pink-400 transition-colors"
            />
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <Link
          href={`/episode/${generateLink(episode.podcast)}/${offset || 0}/${generateLink(episode.title)}-${episode.id}`}
          prefetch={false}
        >
          <h3 className="text-white font-medium text-base mb-1 hover:underline line-clamp-2 overflow-hidden">
            {episode.title}
          </h3>
        </Link>
        {showLinkToPodcast && (
          <Link href={`/podcast/${generateLink(episode.podcast)}`} prefetch={false}>
            <h4 className="text-pink-400 text-sm font-medium mb-2 hover:underline">{episode.podcast}</h4>
          </Link>
        )}

        {!isCompact && (
          <div className="hidden sm:flex">
            <p className="text-gray-400 text-sm line-clamp-2 mb-3 leading-relaxed  overflow-hidden ">
              {episode.description}
            </p>
          </div>
        )}
        {!isCompact && (
          <div className="flex items-center gap-3 text-gray-500 text-xs">
            <span>{episode.date}</span>
            {episode.duration && (
              <>
                <span>•</span>
                <span>{getTime(episode.duration)}</span>
              </>
            )}
          </div>
        )}
      </div>
      <div className={`flex-shrink-0 gap-3 flex items-start flex-col pt-2 relative ${isGrid && "self-baseline"}`}>
        <MenuClick
          items={[
            {
              label: "تشغيل الحلقة",
              onClick: () => {
                if (episode.previewUrl)
                  setCurrentTrack({
                    url: episode.previewUrl || episode.previewUrl,
                    title: episode.title,
                    length: episode.duration ? parseInt(episode.duration) : 0,
                    artist: episode.podcast,
                  });
              },
            },
            ...(showLinkToPodcast
              ? [
                  {
                    label: "الذهاب إلى البودكاست",
                    href: `/podcast/${episode.podcast?.replace(/\s+/g, "-").toLowerCase()}`,
                  },
                ]
              : []),
            {
              label: "الذهاب إلى الحلقة",
              href: `/episode/${generateLink(episode.podcast)}/${offset || 0}/${generateLink(episode.title)}-${
                episode.id
              }`,
            },

            {
              label: "تنزيل الحلقة",
              onClick: () => {
                // download using previewurl
                if (episode.previewUrl) {
                  const link = document.createElement("a");
                  link.href = episode.previewUrl;
                  link.download = `${episode.title}.mp3`;
                  link.target = "_blank";
                  link.rel = "noopener noreferrer";
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              },
            },
          ]}
        />
      </div>
    </div>
  );
};
export default EpisodeCard;
