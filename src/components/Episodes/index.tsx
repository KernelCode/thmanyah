"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import type { Episode } from "../EpisodeCard";
import EpisodeCard from "../EpisodeCard";
import MenuClick from "../MenuClick";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Scrollbar } from "swiper/modules";
import { searchPodcastEpisodes } from "@/utils/search";
import { ItunesResponseEpisode } from "@/utils/types.api";

const Episodes = ({
  episodes: initialEpisodes,
  searchTerm,
  showLinkToPodcast,
}: {
  episodes: Episode[];
  searchTerm: string;
  showLinkToPodcast?: boolean;
}) => {
  const [episodes, setEpisodes] = useState(initialEpisodes);
  const [showType, setShowType] = useState("grid");
  const [offset, setOffset] = useState(initialEpisodes.length);
  const [isLoading, setIsLoading] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(initialEpisodes.length < 10);
  const swiperRef = useRef<SwiperRef | null>(null);

  const handleSlideNext = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slideNext();
    }
  };

  const handleSlidePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleLoadMore = async () => {
    if (reachedEnd || isLoading) return;

    setIsLoading(true);
    try {
      const res = await searchPodcastEpisodes(searchTerm, offset);

      if (!res || res.length === 0) {
        setReachedEnd(true);
        return;
      }
      setEpisodes((prev) => [
        ...prev,
        ...res
          .filter((e: { kind: string }) => e.kind != "podcast")
          .map((episode: ItunesResponseEpisode) => ({
            id: String(episode.trackId),
            title: episode.trackName,
            podcast: episode.collectionName,
            image: episode.artworkUrl600,
            duration: String(episode.trackTimeMillis),
            publishedAt: new Date(episode.releaseDate).toISOString(),
            date: new Date(episode.releaseDate).toLocaleDateString("ar-SA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            podcastId: String(episode.collectionId),
            previewUrl: episode.previewUrl,
            offset: offset,
          })),
      ]);
      setOffset((prev) => prev + res.length);
      setReachedEnd(res.length < 10);
    } catch (error) {
      console.error("Failed to fetch episodes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-12">
        {searchTerm && (
          <h2 className="text-2xl font-bold text-white">
            افضل الحلقات لـ <span>{searchTerm}</span>
          </h2>
        )}
        {!searchTerm && <h2 className="text-4xl my-10 font-bold text-white">حلقات البودكاست</h2>}
        <div className="flex gap-2">
          {showType === "scroll" && (
            <div>
              <button
                onClick={handleSlidePrev}
                className="p-2 hover:bg-200 rounded-full transition-colors cursor-pointer"
              >
                <ChevronRight className="size-5 min-w-5 text-gray-400" />
              </button>
              <button
                onClick={handleSlideNext}
                className="p-2 hover:bg-200 rounded-full transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-5 min-w-5 text-gray-400" />
              </button>
            </div>
          )}
          <MenuClick
            items={[
              { label: "عرض الشبكة", onClick: () => setShowType("grid") },
              { label: "عرض القائمة", onClick: () => setShowType("list") },
              { label: "عرض التمرير", onClick: () => setShowType("scroll") },
              { label: "عرض مضغوط", onClick: () => setShowType("compact") },
            ]}
          />
        </div>
      </div>

      <div className="space-y-2">
        {showType === "list" && (
          <>
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                isGrid
                offset={episode.offset}
                showLinkToPodcast={showLinkToPodcast}
              />
            ))}
          </>
        )}
        {showType === "grid" && (
          <div
            className={`grid ${
              episodes.length > 2
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5"
                : "grid-cols-1 sm:grid-cols-2"
            } gap-4`}
          >
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                isGrid
                offset={episode.offset}
                showLinkToPodcast={showLinkToPodcast}
              />
            ))}
            {!reachedEnd && !isLoading && (
              <button
                onClick={handleLoadMore}
                className="col-span-full bg-pink-400 cursor-pointer hover:bg-pink-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                المزيد
              </button>
            )}
            {isLoading &&
              Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-gray-600 rounded-xl w-full h-full mb-3 aspect-square flex items-center justify-center relative overflow-hidden transition-transform duration-200"
                >
                  <div className="bg-gray-700 animate-pulse w-full h-full"></div>
                </div>
              ))}
          </div>
        )}
        {showType === "scroll" && (
          <div className="space-y-4">
            <Swiper
              ref={swiperRef}
              modules={[Scrollbar]}
              initialSlide={0}
              spaceBetween={6}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1.5 },
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 3 },
              }}
              scrollbar={{ hide: true, draggable: true }}
              onReachEnd={handleLoadMore}
            >
              {episodes.map((episode) => (
                <SwiperSlide key={episode.id}>
                  <EpisodeCard episode={episode} isGrid offset={episode.offset} showLinkToPodcast={showLinkToPodcast} />
                </SwiperSlide>
              ))}
              {isLoading &&
                Array.from({ length: 6 }).map((_, index) => (
                  <SwiperSlide key={index}>
                    <div className="bg-gray-600 rounded-xl w-full h-full mb-3 aspect-square flex items-center justify-center relative overflow-hidden transition-transform duration-200">
                      <div className="bg-gray-700 animate-pulse w-full h-full"></div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          </div>
        )}
        {showType === "compact" && (
          <div
            className={`grid ${
              episodes.length > 2
                ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5"
                : "grid-cols-1 sm:grid-cols-2"
            } gap-4`}
          >
            {episodes.map((episode) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                isGrid
                isCompact
                offset={episode.offset}
                showLinkToPodcast={showLinkToPodcast}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Episodes;
