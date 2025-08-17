"use server";

import { prisma } from "@/lib/prisma";
import { ItunesResponseEpisode, ItunesResponsePodcast } from "./types.api";

const LIMIT = 10; // Default limit for search results

export async function searchPodcasts(query: string, offset: number = 0): Promise<ItunesResponsePodcast[] | undefined> {
  try {
    query = decodeURIComponent(query.trim().replace(/-/g, " ")); // Decode and normalize the query
    console.time("Search Podcasts API Call");
    const resultsCached = await prisma.searchPodcast.findUnique({
      where: {
        query: query + offset, // Unique key based on query and offset
      },
    });
    console.timeEnd("Search Podcasts API Call");

    if (resultsCached) {
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours
      const isCacheExpired = new Date().getTime() - new Date(resultsCached.updatedAt).getTime() > oneDayInMilliseconds;

      if (!isCacheExpired) {
        return resultsCached.Response ? JSON.parse(resultsCached.Response) : undefined;
      }
    }

    const fetchedPodcasts = await getPodcasts(query, offset);

    await prisma.searchPodcast.create({
      data: {
        query: query + offset,
        Response: fetchedPodcasts ? JSON.stringify(fetchedPodcasts.results) : undefined,
      },
    });

    return fetchedPodcasts ? fetchedPodcasts.results : undefined;
  } catch (error) {
    throw error;
  }
}

export async function searchPodcastEpisodes(
  query: string,
  offset: number = 0
): Promise<ItunesResponseEpisode[] | undefined> {
  try {
    console.time("Search Podcast Episodes API Call");
    query = decodeURIComponent(query.trim().replace(/-/g, " ")); // Decode and normalize the query
    const resultsCached = await prisma.searchPodcastEpisode.findUnique({
      where: {
        query: query + offset, // Unique key based on query and offset
      },
    });
    console.timeEnd("Search Podcast Episodes API Call");

    if (resultsCached) {
      const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // 24 hours
      const isCacheExpired = new Date().getTime() - new Date(resultsCached.updatedAt).getTime() > oneDayInMilliseconds;

      if (!isCacheExpired) {
        return resultsCached.Response ? JSON.parse(resultsCached.Response) : undefined;
      }
    }

    const fetchedEpisodes = await getPodcastEpisodes(query, offset);

    await prisma.searchPodcastEpisode.create({
      data: {
        query: query + offset,
        Response: fetchedEpisodes ? JSON.stringify(fetchedEpisodes.results) : undefined,
      },
    });

    return fetchedEpisodes ? fetchedEpisodes.results : undefined;
  } catch (error) {
    throw error;
  }
}

async function getPodcasts(query: string, offset: number): Promise<{ results: ItunesResponsePodcast[] }> {
  let url = `https://itunes.apple.com/search?media=podcast&term=${query}&entity=podcast&limit=${LIMIT}&offset=${offset}&sort=recent`;

  if (query === "all") {
    url = `https://itunes.apple.com/search?media=podcast&term=فنجان&entity=podcast&limit=${LIMIT}&offset=${offset}&sort=recent`;
  }
  const podcastResponse = await fetch(url, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  return await podcastResponse.json();
}

async function getPodcastEpisodes(query: string, offset: number): Promise<{ results: ItunesResponseEpisode[] }> {
  let url = `https://itunes.apple.com/search?media=podcast&term=${query}&entity=podcastEpisode&limit=${LIMIT}&offset=${offset}&sort=recent`;

  if (query === "all") {
    url = `https://itunes.apple.com/search?media=podcast&term=فنجان&entity=podcastEpisode&limit=${LIMIT}&offset=${offset}&sort=recent`;
  }
  const podcastEpisodeResponse = await fetch(url, {
    next: { revalidate: 86400 }, // Cache for 24 hours
  });

  return await podcastEpisodeResponse.json();
}
