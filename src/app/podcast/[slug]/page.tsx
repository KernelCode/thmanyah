// podcast details page
import React from "react";
import Image from "next/image";
import type { Metadata } from "next";

import Episodes from "@/components/Episodes";
import { ItunesResponseEpisode, ItunesResponsePodcast } from "@/utils/types.api";
import { searchPodcastEpisodes, searchPodcasts } from "@/utils/search";
import { notFound } from "next/navigation";

export const revalidate = 3600;
export const dynamic = "force-static";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const slug = (await params).slug.trim().replace(/-/g, " ");
  let podcast: ItunesResponsePodcast | undefined;

  try {
    const podcasts = await searchPodcasts(slug, 0);
    podcast = podcasts?.[0];
  } catch (error) {
    console.error("Error fetching podcast metadata:", error);
  }

  if (!podcast) {
    return {
      title: "Podcast Not Found",
      description: "The requested podcast could not be found.",
    };
  }

  return {
    title: `${podcast.collectionName} - ${podcast.artistName}`,
    description: podcast.collectionName || "لايوجد وصف حالياً!",
    openGraph: {
      title: podcast.collectionName,
      description: podcast.collectionName || "لايوجد وصف حالياً!",
      images: [{ url: podcast.artworkUrl600 }],
      type: "website",
    },
  };
}

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug.trim().replace(/-/g, " ");
  let podcast: ItunesResponsePodcast | undefined;
  let episodes: ItunesResponseEpisode[] = [];

  try {
    const [podcastEpisodes, podcasts] = await Promise.all([searchPodcastEpisodes(slug, 0), searchPodcasts(slug, 0)]);

    podcast = podcasts?.[0];
    episodes = podcastEpisodes || [];
  } catch (error) {
    console.error("Error fetching podcast:", error);
    throw notFound();
  }

  if (!podcast) {
    throw notFound();
  }

  return (
    <div className="container p-4">
      <h1 className="text-4xl font-bold mb-4">{podcast.collectionName || "Unknown Podcast"}</h1>
      <p className="text-gray-600 mb-2">{podcast.artistName || "Unknown Artist"}</p>
      <Image
        src={podcast.artworkUrl600 || "/placeholder-image.png"}
        alt={podcast.collectionName || "Podcast artwork"}
        width={400}
        height={400}
        className="rounded-lg mb-16"
        loading="lazy"
      />

      <Episodes
        searchTerm={podcast.collectionName || "Unknown Podcast"}
        episodes={episodes
          .filter((e) => e.kind != "podcast")
          .map((episode: ItunesResponseEpisode) => {
            return {
              id: String(episode.trackId),
              image: episode.artworkUrl600,
              title: episode.trackName,
              description: episode.shortDescription,
              date: new Date(episode.releaseDate).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              duration: String(episode.trackTimeMillis),
              podcastId: String(episode.collectionId),
              previewUrl: episode.previewUrl,
              podcast: episode.collectionName,
            };
          })}
      />
    </div>
  );
};

export default Page;
