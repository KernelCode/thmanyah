-- CreateEnum
CREATE TYPE "public"."Kind" AS ENUM ('PODCAST_EPISODE', 'PODCAST');

-- CreateTable
CREATE TABLE "public"."SearchPodcast" (
    "query" TEXT NOT NULL,
    "Response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchPodcast_pkey" PRIMARY KEY ("query")
);

-- CreateTable
CREATE TABLE "public"."SearchPodcastEpisode" (
    "query" TEXT NOT NULL,
    "Response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SearchPodcastEpisode_pkey" PRIMARY KEY ("query")
);

-- CreateTable
CREATE TABLE "public"."ResourceResult" (
    "id" TEXT NOT NULL,
    "kind" "public"."Kind" NOT NULL,
    "response" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResourceResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SearchPodcast_query_key" ON "public"."SearchPodcast"("query");

-- CreateIndex
CREATE UNIQUE INDEX "SearchPodcastEpisode_query_key" ON "public"."SearchPodcastEpisode"("query");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceResult_id_key" ON "public"."ResourceResult"("id");
