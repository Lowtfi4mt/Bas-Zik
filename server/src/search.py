"""
Module for searching authors, musics and albums in the app
"""

from flask_smorest import Blueprint
from flask.views import MethodView
from models import Author, AppMusic, Album
from schemas import SearchResultSchema

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
        authors = Author.query.filter(Author.name.ilike(f"%{query}%")).all()
        musics = AppMusic.query.filter(AppMusic.title.ilike(f"%{query}%")).all()
        albums = Album.query.filter(Album.title.ilike(f"%{query}%")).all()

        return {
            "authors": authors,
            "musics": musics,
            "albums": albums,
        }
