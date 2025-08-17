// podcast details page
import React from "react";
import { notFound } from "next/navigation";
import { RssIcon, AppleIcon, DownloadIcon, Clock10Icon } from "lucide-react";
import Image from "next/image";
import PlayButton from "@/components/PlayButton";
import { searchPodcastEpisodes } from "@/utils/search";
import getTime from "@/lib/getTime";
import type { Metadata } from "next";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collectionSlug: string; offset: string; slug: string }>;
}): Promise<Metadata> {
  const { collectionSlug, offset, slug } = await params;
  const trackIdMatched = decodeURIComponent(slug).match(/(\d+)$/);
  const trackId = trackIdMatched ? parseInt(trackIdMatched[0], 10) : null;

  if (!trackId) {
    notFound();
  }

  const podcast = await searchPodcastEpisodes(collectionSlug.trim().replace(/-/g, " "), parseInt(offset));

  if (!podcast) {
    notFound();
  }

  const episode = podcast.find((ep: { trackId: number }) => ep.trackId === trackId);

  if (!episode) {
    notFound();
  }

  return {
    title: `${episode.trackName} - ${episode.collectionName}`,
    description: episode.description || "لايوجد وصف حالياً!",
    openGraph: {
      title: episode.trackName,
      description: episode.description || "لايوجد وصف حالياً!",
      images: [episode.artworkUrl600],
      type: "website",
    },
  };
}

const Page = async ({ params }: { params: Promise<{ collectionSlug: string; offset: string; slug: string }> }) => {
  const { collectionSlug, offset, slug } = await params;
  const trackIdMatched = decodeURIComponent(slug).match(/(\d+)$/);
  const trackId = trackIdMatched ? parseInt(trackIdMatched[0], 10) : null;

  if (!trackId) {
    notFound();
  }

  const podcast = await searchPodcastEpisodes(collectionSlug.trim().replace(/-/g, " "), parseInt(offset));

  if (!podcast) {
    notFound();
  }

  const episode = podcast.find((ep: { trackId: number }) => ep.trackId === trackId);

  if (!episode) {
    notFound();
  }

  return (
    <div className="container p-4 flex flex-col gap-5">
      <div className="relative w-full sm:w-fit">
        <Image
          src={episode.artworkUrl600}
          alt={episode.collectionName || "Podcast artwork"}
          className="rounded-lg  w-full h-full sm:size-60 object-cover"
          width={200}
          height={200}
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center ">
          <PlayButton
            episode={{
              id: episode.trackId.toString(),
              title: episode.trackName,
              podcast: episode.collectionName,
              image: episode.artworkUrl600,
              description: episode.description,
              date: episode.releaseDate,
              duration: episode.trackTimeMillis ? episode.trackTimeMillis.toFixed(0) : "0",
              podcastId: episode.collectionId.toString(),
              offset: offset ? parseInt(offset) : 0,
              previewUrl: episode.previewUrl || episode.previewUrl,
            }}
            big
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-bold ">{episode.trackName}</h1>
        <h3 className="text-gray-500 mb-4 flex gap-2">
          <Clock10Icon />
          {getTime(episode.trackTimeMillis ? episode.trackTimeMillis : 0)} •{" "}
          {new Date(episode.releaseDate).toLocaleDateString("ar-SA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h3>
        <p className="text-gray-600 mb-2 text-xl sm:text-2xl">{episode.description || "لايوجد وصف حالياً!"}</p>
        <div className="flex gap-4 mb-5">
          {episode.feedUrl && (
            <a
              href={episode.feedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 flex items-center gap-2"
            >
              <RssIcon className="w-5 h-5" />
              رابط RSS
            </a>
          )}
          {episode.trackViewUrl && (
            <a
              href={episode.trackViewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-400 flex items-center gap-2"
            >
              <AppleIcon className="w-5 h-5" />
              آيتونز
            </a>
          )}
          {episode.previewUrl && (
            <a href={episode.previewUrl} download className="text-pink-400 flex items-center gap-2">
              <DownloadIcon className="w-5 h-5" />
              تنزيل
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
