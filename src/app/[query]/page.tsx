import React, { Suspense } from "react";
import { Metadata } from "next";

import Podcasts from "@/components/Podcasts";

import { ItunesResponseEpisode, ItunesResponsePodcast } from "@/utils/types.api";
import { searchPodcastEpisodes, searchPodcasts } from "@/utils/search";
import { FetchingData } from "@/components/FetchingData/FetchingData";
import Episodes from "@/components/Episodes";
import ResultsSkeleton from "@/components/ResultsSkeleton";

type Iprops = {
  params: Promise<{ query: string }>;
};

export const revalidate = 3600;
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "تجربة ثمانية",
  description: "استكشف البودكاست والحلقات على تجربة ثمانية.",
  keywords: "بودكاست, حلقات, ثمانية, تجربة",
};

export default async function Page(props: Iprops) {
  const params = await props.params;
  const { query } = await params;
  const queryDecoded = decodeURIComponent(query);

  return (
    <>
      <Suspense fallback={<ResultsSkeleton />}>
        <FetchingData
          apiPromies={async () => {
            return await searchPodcasts(queryDecoded.trim().replace(/-/g, " "));
          }}
        >
          {(data) => {
            const res = data as ItunesResponsePodcast[];
            return (
              <Podcasts
                query={queryDecoded}
                podcasts={res.map((podcast: ItunesResponsePodcast) => {
                  return {
                    collectionId: podcast.collectionId ? String(podcast.collectionId) : "",
                    image: podcast.artworkUrl600,
                    host: podcast.artistName,
                    title: podcast.collectionName,
                  };
                })}
              />
            );
          }}
        </FetchingData>
      </Suspense>

      <Suspense fallback={<ResultsSkeleton />}>
        <FetchingData
          apiPromies={async () => {
            return await searchPodcastEpisodes(queryDecoded.trim().replace(/-/g, " "));
          }}
        >
          {(data) => {
            const res = data as ItunesResponseEpisode[];
            return (
              <Episodes
                showLinkToPodcast
                searchTerm={queryDecoded}
                episodes={res
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
                      showLinkToPodcast: true,
                    };
                  })}
              />
            );
          }}
        </FetchingData>
      </Suspense>
    </>
  );
}
