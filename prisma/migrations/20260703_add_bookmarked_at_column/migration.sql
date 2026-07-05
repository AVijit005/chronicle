-- AlterTable: Add bookmarkedAt column to all junction tables
-- This restores proper bookmark timestamp semantics.
-- bookmarkedAt records when the bookmark was SET, not when the item was last updated.

ALTER TABLE "user_movies" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_tv_shows" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_tv_seasons" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_tv_episodes" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_anime" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_anime_episodes" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_books" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_games" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_music_albums" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_music_tracks" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_podcasts" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_podcast_episodes" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_courses" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_course_modules" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
ALTER TABLE "user_course_lessons" ADD COLUMN "bookmarked_at" TIMESTAMP(3);
