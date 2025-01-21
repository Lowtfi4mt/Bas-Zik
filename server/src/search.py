"""
Module for searching authors, musics and albums in the app
"""

from flask_smorest import Blueprint
from flask.views import MethodView
from fuzzywuzzy import fuzz

from models import Author, AppMusic, Album
from schemas import SearchResultSchema

MAX_SEARCH_RESULTS = 10

search_blp = Blueprint(
    "search",
    __name__,
    url_prefix="/search",
    description="Search operations",
)


@search_blp.route("/<string:query>")
class SearchResource(MethodView):
    """
    Resource for searching authors, musics and albums
    """

    @search_blp.response(200, SearchResultSchema)
    def get(self, query):
        """
        Search authors, musics and albums
        """

        authors = Author.query.filter(Author.name.ilike(f"%{query}%")).limit(
            MAX_SEARCH_RESULTS
        )
        musics = AppMusic.query.filter(AppMusic.title.ilike(f"%{query}%")).limit(
            MAX_SEARCH_RESULTS
        )
        albums = Album.query.filter(Album.name.ilike(f"%{query}%")).limit(
            MAX_SEARCH_RESULTS
        )

        return {
            "authors": authors,
            "musics": musics,
            "albums": albums,
        }


@search_blp.route("/<string:query>/fuzzy/<int:threshold>")
class FuzzySearchResource(MethodView):
    """
    Resource for fuzzy searching authors, musics and albums
    """

    @search_blp.response(200, SearchResultSchema)
    def get(self, query, threshold):
        """
        Fuzzy search authors, musics and albums
        """

        authors = Author.query.all()
        musics = AppMusic.query.all()
        albums = Album.query.all()

        authors = [
            {
                **author.__dict__,
                "image_path": author.app_musics[0].path,
                "music_count": len(author.app_musics),
                "albums_count": len(author.albums),
            }
            for author in authors
            if fuzz.partial_ratio(author.name.lower(), query.lower()) >= threshold
        ][:MAX_SEARCH_RESULTS]

        musics = [
            {
                **music.__dict__,
                "image_path": music.path,
                "authors": music.authors,
                "albums": music.albums,
            }
            for music in musics
            if fuzz.partial_ratio(music.title.lower(), query.lower()) >= threshold
        ][:MAX_SEARCH_RESULTS]

        albums = [
            {
                **album.__dict__,
                "image_path": album.app_musics[0].path,
                "music_count": len(album.app_musics),
                "authors": album.authors,
            }
            for album in albums
            if fuzz.partial_ratio(album.name.lower(), query.lower()) >= threshold
        ][:MAX_SEARCH_RESULTS]

        return {
            "authors": authors,
            "musics": musics,
            "albums": albums,
        }
