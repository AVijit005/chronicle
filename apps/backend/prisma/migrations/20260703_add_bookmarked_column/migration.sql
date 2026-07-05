-- AlterTable: Add bookmarked column to all junction tables
-- This is a safe, additive migration. All existing rows get bookmarked=false.

ALTER TABLE "user_movies" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_tv_shows" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_tv_seasons" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_tv_episodes" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_anime" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_anime_episodes" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_books" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_games" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_music_albums" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_music_tracks" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_podcasts" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_podcast_episodes" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_courses" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_course_modules" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "user_course_lessons" ADD COLUMN "bookmarked" BOOLEAN NOT NULL DEFAULT false;
