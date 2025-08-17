// podcast details page
import React from "react";
import { notFound } from "next/navigation";
import Head from "next/head";

import Image from "next/image";

import Episodes from "@/components/Episodes";
import { ItunesResponseEpisode, ItunesResponsePodcast } from "@/utils/types.api";
import { searchPodcastEpisodes, searchPodcasts } from "@/utils/search";

export const revalidate = 3600;
export const dynamic = "force-static";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  let podcast: ItunesResponsePodcast | undefined;
  let episodes: ItunesResponseEpisode[] = [];

  try {
    const [podcastEpisodes, podcasts] = await Promise.all([
      searchPodcastEpisodes(slug.trim().replace(/-/g, " "), 0),
      searchPodcasts(slug.trim().replace(/-/g, " "), 0),
    ]);

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
    <>
      <Head>
        <title>
          {podcast.collectionName} - {podcast.artistName}
        </title>
        <meta name="description" content={podcast.collectionName || "لايوجد وصف حالياً!"} />
        <meta property="og:title" content={podcast.collectionName} />
        <meta property="og:description" content={podcast.collectionName || "لايوجد وصف حالياً!"} />
        <meta property="og:image" content={podcast.artworkUrl600} />
        <meta property="og:type" content="website" />
      </Head>
      <div className="container  p-4">
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
    </>
  );
};

export default Page;
