"""
Module for handling music albums
"""

from flask_smorest import Blueprint
from flask.views import MethodView

from schemas import AlbumSchema
from models import db, Album

albums_blp = Blueprint(
    "albums",
    __name__,
    url_prefix="/albums",
    description="Operations on albums",
)


@albums_blp.route("/")
class AlbumResource(MethodView):
    """
    Resource for albums
    """

    @albums_blp.response(200, AlbumSchema(many=True))
    def get(self):
        """
        Get all albums
        """
        return Album.query.all()

    @albums_blp.arguments(AlbumSchema(session=db.session))
    @albums_blp.response(201, AlbumSchema)
    def post(self, new_album):
        """
        Add a new album
        """
        db.session.add(new_album)
        db.session.commit()
        return new_album


@albums_blp.route("/<int:album_id>")
class AlbumDetailResource(MethodView):
    """
    Resource for a specific album
    """

    @albums_blp.response(200, AlbumSchema)
    def get(self, album_id):
        """
        Get a specific album
        """
        return Album.query.get_or_404(album_id)

    @albums_blp.arguments(AlbumSchema(session=db.session))
    @albums_blp.response(200, AlbumSchema)
    def put(self, album, album_id):
        """
        Update a specific album
        """
        album = Album.query.get_or_404(album_id)
        album.update(album)
        db.session.commit()
        return album

    @albums_blp.response(204)
    def delete(self, album_id):
        """
        Delete a specific album
        """
        album = Album.query.get_or_404(album_id)
        db.session.delete(album)
        db.session.commit()
        return None
