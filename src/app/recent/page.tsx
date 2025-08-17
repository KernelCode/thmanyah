"use client";

import Head from "next/head";
import EpisodeCard from "@/components/EpisodeCard";
import useAudioStore from "@/lib/store";

const Page = () => {
  const { lastPlays } = useAudioStore();

  return (
    <>
      <Head>
        <title>اخر ماتم تشغيلة</title>
        <meta name="description" content="Browse recently played episodes." />
      </Head>
      <div>
        <div className="space-y-2">
          {lastPlays?.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} isGrid offset={episode.offset} showLinkToPodcast={false} />
          ))}
          {(!lastPlays || lastPlays?.length === 0) && (
            <div className="text-center text-gray-500 my-20 text-4xl">لا توجد حلقات تم تشغيلها مؤخرًا.</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Page;
