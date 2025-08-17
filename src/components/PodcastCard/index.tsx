import Image from "next/image";
import MenuClick from "../MenuClick";
import Link from "next/link";
import { generateLink } from "@/utils/generateLinks";

export type Podcast = {
  collectionId: string;
  title: string;
  host: string;
  image: string;
};
const PodcastCard = ({ podcast }: { podcast: Podcast }) => (
  <Link
    href={`/podcast/${generateLink(podcast.title)}`}
    prefetch
    className="group cursor-pointer bg-100 hover:bg-200 p-2 block "
  >
    <div className=" rounded-xl  mb-3  ">
      <Image
        src={podcast.image}
        alt={podcast.title}
        width={200}
        height={200}
        className="rounded-lg object-cover  aspect-square w-full h-full transition-all duration-200 group-hover:scale-105 group-hover:opacity-50"
        loading="lazy"
      />
    </div>
    <div className="flex justify-between overflow-hidden">
      <div>
        <h3 className="text-white font-medium text-sm mb-1 line-clamp-2 hover:underline">{podcast.title}</h3>
        <p className="text-gray-400 text-xs">{podcast.host}</p>
      </div>
      <MenuClick />
    </div>
  </Link>
);

export default PodcastCard;
