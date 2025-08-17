import React, { Suspense } from "react";

import Podcasts from "@/components/Podcasts";

import { ItunesResponseEpisode, ItunesResponsePodcast } from "@/utils/types.api";
import { searchPodcastEpisodes, searchPodcasts } from "@/utils/search";
import { FetchingData } from "@/components/FetchingData/FetchingData";
import Episodes from "@/components/Episodes";
import ResultsSkeleton from "@/components/ResultsSkeleton";

import ErrorBoundary from "@/components/ErrorFallback";

export const revalidate = 3600;
export const dynamic = "force-static";

export default async function Page() {
  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<ResultsSkeleton />}>
          <FetchingData
            apiPromies={async () => {
              return await searchPodcasts("all");
            }}
          >
            {(data) => {
              const res = data as ItunesResponsePodcast[];
              return (
                <Podcasts
                  query={"الكل"}
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
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<ResultsSkeleton />}>
          <FetchingData
            apiPromies={async () => {
              return await searchPodcastEpisodes("all");
            }}
          >
            {(data) => {
              const res = data as ItunesResponseEpisode[];
              return (
                <Episodes
                  searchTerm={"الكل"}
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
                  showLinkToPodcast
                />
              );
            }}
          </FetchingData>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
