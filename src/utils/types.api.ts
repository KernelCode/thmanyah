interface Genre {
  id: string;
  name: string;
}

// Alternative with more specific literal types for known values
export type ItunesResponseEpisode = {
  artistIds: string[];
  artworkUrl160: string;
  artworkUrl60: string;
  artworkUrl600: string;
  closedCaptioning: "none" | "available";
  collectionId: number;
  collectionName: string;
  collectionViewUrl: string;
  contentAdvisoryRating: "Clean" | "Explicit";
  country: string;
  description: string;
  episodeContentType: "audio" | "video";
  episodeFileExtension: string;
  episodeGuid: string;
  episodeUrl: string;
  feedUrl: string;
  genres: Genre[];
  kind: "podcast-episode" | "podcast";
  previewUrl: string;
  releaseDate: string; // ISO 8601 date string
  shortDescription: string;
  trackId: number;
  trackName: string;
  trackTimeMillis: number;
  trackViewUrl: string;
  wrapperType: "podcastEpisode";
  artistName: string;
};

export type ItunesResponsePodcast = {
  id: string;
  wrapperType: string;
  kind: string;
  collectionId?: number;
  trackId?: number;
  artistName: string;
  collectionName: string;
  trackName: string;
  collectionCensoredName: string;
  collectionViewUrl: string;
  feedUrl: string;
  trackViewUrl: string;
  artworkUrl30: string;
  artworkUrl60: string;
  artworkUrl100: string;
  releaseDate: Date;
  country: string;
  primaryGenreName: string;
  artworkUrl600: string;
  searchedKeywords: string[];
};

export type lookupPodcastEpisode = {
  resultCount: number;
  results: ItunesResponseEpisode[];
};
