"""
Module for handling music albums
"""

from flask_smorest import Blueprint
from flask.views import MethodView
from schemas import AlbumSchema

albums_blp = Blueprint(
    "albums",
    __name__,
    url_prefix="/albums",
    description="Operations on albums",
)


@albums_blp.route("/")
class Albums(MethodView):
    """
    Resource for albums
    """

    @albums_blp.response(200, AlbumSchema(many=True))
    def get(self):
        """
        Get all albums
        """
        return []

    @albums_blp.arguments(AlbumSchema)
    @albums_blp.response(201, AlbumSchema)
    def post(self, new_album):
        """
        Add a new album
        """
        return new_album

    @albums_blp.arguments(AlbumSchema)
    @albums_blp.response(200, AlbumSchema)
    def put(self, album):
        """
        Update an album
        """
        return album
