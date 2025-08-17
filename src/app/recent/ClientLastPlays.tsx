"use client";
import EpisodeCard from "@/components/EpisodeCard";
import useAudioStore from "@/lib/store";

const ClientLastPlays = () => {
  const { lastPlays } = useAudioStore();
  return (
    <div className="space-y-2">
      {lastPlays?.map((episode) => (
        <EpisodeCard key={episode.id} episode={episode} isGrid offset={episode.offset} showLinkToPodcast={false} />
      ))}
      {(!lastPlays || lastPlays?.length === 0) && (
        <div className="text-center text-gray-500 my-20 text-4xl">لا توجد حلقات تم تشغيلها مؤخرًا.</div>
      )}
    </div>
  );
};

export default ClientLastPlays;
