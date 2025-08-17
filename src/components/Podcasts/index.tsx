"use client";

import { Swiper, SwiperRef, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/scrollbar";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Scrollbar } from "swiper/modules";
import MenuClick from "../MenuClick";
import type { Podcast } from "../PodcastCard";
import PodcastCard from "../PodcastCard";

import { searchPodcasts } from "@/utils/search";

const Podcasts = ({ podcasts: initialPodcasts, query }: { podcasts: Podcast[]; query: string }) => {
  const [podcasts, setPodcasts] = useState(initialPodcasts);
  const [showType, setShowType] = useState("scroll");
  const [offset, setOffset] = useState(initialPodcasts.length);
  const [isLoading, setIsLoading] = useState(false);
  const swiperRef = useRef<SwiperRef | null>(null);
  const [reachedEnd, setReachedEnd] = useState(initialPodcasts.length < 10);
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

  const handleReachEnd = async () => {
    if (reachedEnd) return;
    if (isLoading) return;

    setIsLoading(true);
    try {
      const res = await searchPodcasts(query, offset);
      if (!res || res.length === 0) return;

      setPodcasts((prev) => [
        ...prev,
        ...res.map((podcast) => ({
          collectionId: String(podcast.collectionId),
          image: podcast.artworkUrl600,
          host: podcast.artistName,
          title: podcast.collectionName,
        })),
      ]);
      setReachedEnd(res.length < 10);
      setOffset((prev) => prev + res.length);
    } catch (error) {
      console.error("Failed to fetch podcasts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  if (podcasts.length === 0) return null;
  return (
    <section className="mb-12 block">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">
          أفضل البودكاست لـ <span>{query}</span>
        </h2>
        <div className="flex items-center gap-2">
          {showType === "scroll" && (
            <>
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
            </>
          )}

          <MenuClick
            items={[
              {
                label: showType === "grid" ? "عرض التمرير" : "عرض الشبكة",
                onClick: () => {
                  setShowType(showType === "grid" ? "scroll" : "grid");
                },
              },
            ]}
          />
        </div>
      </div>
      {showType === "grid" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {podcasts.map((podcast) => (
            <PodcastCard key={podcast.collectionId} podcast={podcast} />
          ))}
          {!reachedEnd && !isLoading && (
            <button
              onClick={handleReachEnd}
              className="col-span-full bg-gray-700 cursor-pointer hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              المزيد
            </button>
          )}
          {isLoading &&
            Array.from({ length: 6 }).map((_, index: number) => (
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
        <div className="space-y-4 relative">
          {podcasts && podcasts.length > 0 && (
            <Swiper
              ref={swiperRef}
              modules={[Scrollbar]}
              slidesPerView={2}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                768: {
                  slidesPerView: 4,
                },
                1024: {
                  slidesPerView: 5,
                },
                1280: {
                  slidesPerView: 6,
                },
              }}
              initialSlide={0}
              spaceBetween={6}
              scrollbar={{
                hide: true,
                draggable: true,
              }}
              onReachEnd={handleReachEnd}
              className="overflow-hidden"
            >
              {podcasts.map((podcast) => (
                <SwiperSlide key={podcast.collectionId}>
                  <PodcastCard podcast={podcast} />
                </SwiperSlide>
              ))}
              {isLoading &&
                Array.from({ length: 3 }).map((_, index: number) => (
                  <SwiperSlide key={index}>
                    <div className="group cursor-pointer bg-100 hover:bg-200 p-2 ">
                      <div className="bg-gray-600 rounded-xl w-full h-full mb-3 aspect-square flex items-center justify-center relative overflow-hidden transition-transform duration-200"></div>
                      <div className="flex justify-between overflow-hidden">
                        <div>
                          <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 hover:underline">
                            يتم التحميل
                          </h3>
                          <p className="text-gray-400 text-xs">انتظر قليلاً</p>
                        </div>
                        <MenuClick />
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>
      )}
    </section>
  );
};

export default Podcasts;
