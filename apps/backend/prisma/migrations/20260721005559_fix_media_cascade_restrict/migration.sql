-- DropForeignKey
ALTER TABLE "tv_episodes" DROP CONSTRAINT "tv_episodes_tv_season_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tv_seasons" DROP CONSTRAINT "user_tv_seasons_tv_season_id_fkey";

-- DropForeignKey
ALTER TABLE "user_tv_episodes" DROP CONSTRAINT "user_tv_episodes_tv_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "user_anime_episodes" DROP CONSTRAINT "user_anime_episodes_anime_episode_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_book_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_course_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_game_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_music_album_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "collection_items" DROP CONSTRAINT "collection_items_tv_show_id_fkey";

-- DropForeignKey
ALTER TABLE "shelf_items" DROP CONSTRAINT "shelf_items_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "shelf_items" DROP CONSTRAINT "shelf_items_book_id_fkey";

-- DropForeignKey
ALTER TABLE "shelf_items" DROP CONSTRAINT "shelf_items_course_id_fkey";

-- DropForeignKey
ALTER TABLE "shelf_items" DROP CONSTRAINT "shelf_items_game_id_fkey";

-- DropForeignKey
ALTER TABLE "shelf_items" DROP CONSTRAINT "shelf_items_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "shelf_items" DROP CONSTRAINT "shelf_items_music_album_id_fkey";

-- DropForeignKey
ALTER TABLE "shelf_items" DROP CONSTRAINT "shelf_items_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "shelf_items" DROP CONSTRAINT "shelf_items_tv_show_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_list_items" DROP CONSTRAINT "custom_list_items_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_list_items" DROP CONSTRAINT "custom_list_items_book_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_list_items" DROP CONSTRAINT "custom_list_items_course_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_list_items" DROP CONSTRAINT "custom_list_items_game_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_list_items" DROP CONSTRAINT "custom_list_items_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_list_items" DROP CONSTRAINT "custom_list_items_music_album_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_list_items" DROP CONSTRAINT "custom_list_items_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "custom_list_items" DROP CONSTRAINT "custom_list_items_tv_show_id_fkey";

-- DropForeignKey
ALTER TABLE "media_tags" DROP CONSTRAINT "media_tags_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "media_tags" DROP CONSTRAINT "media_tags_book_id_fkey";

-- DropForeignKey
ALTER TABLE "media_tags" DROP CONSTRAINT "media_tags_course_id_fkey";

-- DropForeignKey
ALTER TABLE "media_tags" DROP CONSTRAINT "media_tags_game_id_fkey";

-- DropForeignKey
ALTER TABLE "media_tags" DROP CONSTRAINT "media_tags_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "media_tags" DROP CONSTRAINT "media_tags_music_album_id_fkey";

-- DropForeignKey
ALTER TABLE "media_tags" DROP CONSTRAINT "media_tags_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "media_tags" DROP CONSTRAINT "media_tags_tv_show_id_fkey";

-- DropForeignKey
ALTER TABLE "memory_media" DROP CONSTRAINT "memory_media_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "memory_media" DROP CONSTRAINT "memory_media_book_id_fkey";

-- DropForeignKey
ALTER TABLE "memory_media" DROP CONSTRAINT "memory_media_course_id_fkey";

-- DropForeignKey
ALTER TABLE "memory_media" DROP CONSTRAINT "memory_media_game_id_fkey";

-- DropForeignKey
ALTER TABLE "memory_media" DROP CONSTRAINT "memory_media_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "memory_media" DROP CONSTRAINT "memory_media_music_album_id_fkey";

-- DropForeignKey
ALTER TABLE "memory_media" DROP CONSTRAINT "memory_media_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "memory_media" DROP CONSTRAINT "memory_media_tv_show_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_quotes" DROP CONSTRAINT "favorite_quotes_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_quotes" DROP CONSTRAINT "favorite_quotes_book_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_quotes" DROP CONSTRAINT "favorite_quotes_course_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_quotes" DROP CONSTRAINT "favorite_quotes_game_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_quotes" DROP CONSTRAINT "favorite_quotes_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_quotes" DROP CONSTRAINT "favorite_quotes_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "favorite_quotes" DROP CONSTRAINT "favorite_quotes_tv_show_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_book_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_course_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_game_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_music_album_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "highlights" DROP CONSTRAINT "highlights_tv_show_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_anime_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_book_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_course_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_game_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_movie_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_music_album_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_podcast_id_fkey";

-- DropForeignKey
ALTER TABLE "recommendations" DROP CONSTRAINT "recommendations_tv_show_id_fkey";

-- AddForeignKey
ALTER TABLE "tv_episodes" ADD CONSTRAINT "tv_episodes_tv_season_id_fkey" FOREIGN KEY ("tv_season_id") REFERENCES "tv_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tv_seasons" ADD CONSTRAINT "user_tv_seasons_tv_season_id_fkey" FOREIGN KEY ("tv_season_id") REFERENCES "tv_seasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_tv_episodes" ADD CONSTRAINT "user_tv_episodes_tv_episode_id_fkey" FOREIGN KEY ("tv_episode_id") REFERENCES "tv_episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_anime_episodes" ADD CONSTRAINT "user_anime_episodes_anime_episode_id_fkey" FOREIGN KEY ("anime_episode_id") REFERENCES "anime_episodes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_music_album_id_fkey" FOREIGN KEY ("music_album_id") REFERENCES "music_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_items" ADD CONSTRAINT "shelf_items_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_items" ADD CONSTRAINT "shelf_items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_items" ADD CONSTRAINT "shelf_items_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_items" ADD CONSTRAINT "shelf_items_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_items" ADD CONSTRAINT "shelf_items_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_items" ADD CONSTRAINT "shelf_items_music_album_id_fkey" FOREIGN KEY ("music_album_id") REFERENCES "music_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_items" ADD CONSTRAINT "shelf_items_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shelf_items" ADD CONSTRAINT "shelf_items_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_list_items" ADD CONSTRAINT "custom_list_items_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_list_items" ADD CONSTRAINT "custom_list_items_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_list_items" ADD CONSTRAINT "custom_list_items_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_list_items" ADD CONSTRAINT "custom_list_items_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_list_items" ADD CONSTRAINT "custom_list_items_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_list_items" ADD CONSTRAINT "custom_list_items_music_album_id_fkey" FOREIGN KEY ("music_album_id") REFERENCES "music_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_list_items" ADD CONSTRAINT "custom_list_items_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_list_items" ADD CONSTRAINT "custom_list_items_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_music_album_id_fkey" FOREIGN KEY ("music_album_id") REFERENCES "music_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_tags" ADD CONSTRAINT "media_tags_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_music_album_id_fkey" FOREIGN KEY ("music_album_id") REFERENCES "music_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "memory_media" ADD CONSTRAINT "memory_media_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_quotes" ADD CONSTRAINT "favorite_quotes_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_quotes" ADD CONSTRAINT "favorite_quotes_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_quotes" ADD CONSTRAINT "favorite_quotes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_quotes" ADD CONSTRAINT "favorite_quotes_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_quotes" ADD CONSTRAINT "favorite_quotes_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_quotes" ADD CONSTRAINT "favorite_quotes_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_quotes" ADD CONSTRAINT "favorite_quotes_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_music_album_id_fkey" FOREIGN KEY ("music_album_id") REFERENCES "music_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "highlights" ADD CONSTRAINT "highlights_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "books"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "games"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_music_album_id_fkey" FOREIGN KEY ("music_album_id") REFERENCES "music_albums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_podcast_id_fkey" FOREIGN KEY ("podcast_id") REFERENCES "podcasts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendations" ADD CONSTRAINT "recommendations_tv_show_id_fkey" FOREIGN KEY ("tv_show_id") REFERENCES "tv_shows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

