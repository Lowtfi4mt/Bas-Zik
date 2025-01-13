"""
Module for handling app musics and proposed musics
"""

from flask_smorest import Blueprint
from flask.views import MethodView
from schemas import (
    AppMusicSchema,
    ProposedMusicSchema,
)

musics_blp = Blueprint(
    "musics",
    __name__,
    url_prefix="/musics",
    description="Operations on musics",
)


@musics_blp.route("/app")
class AppMusic(MethodView):
    """
    Resource for app musics
    """

    @musics_blp.response(200, AppMusicSchema(many=True))
    def get(self):
        """
        Get all musics in the app
        """
        return []

    @musics_blp.arguments(AppMusicSchema)
    @musics_blp.response(201, AppMusicSchema)
    def post(self, new_music):
        """
        Add a new music to the app
        """
        return new_music

    @musics_blp.arguments(AppMusicSchema)
    @musics_blp.response(200, AppMusicSchema)
    def put(self, music):
        """
        Update a music in the app
        """
        return music


@musics_blp.route("/app/<int:music_id>")
class AppMusicById(MethodView):
    """
    Resource for a specific app music
    """

    @musics_blp.response(200, AppMusicSchema)
    def get(self, music_id):
        """
        Get a specific app music
        """
        return {}

    @musics_blp.arguments(AppMusicSchema)
    @musics_blp.response(200, AppMusicSchema)
    def put(self, music, music_id):
        """
        Update a specific app music
        """
        return music

    @musics_blp.response(204)
    def delete(self, music_id):
        """
        Delete a specific app music
        """
        return None


@musics_blp.route("/proposals")
class ProposedMusic(MethodView):
    """
    Resource for proposed musics
    """

    @musics_blp.response(200, ProposedMusicSchema(many=True))
    def get(self):
        """
        Get all proposed musics
        """
        return []

    @musics_blp.arguments(ProposedMusicSchema)
    @musics_blp.response(201, ProposedMusicSchema)
    def post(self, new_proposal):
        """
        Add a new music proposal
        """
        return new_proposal


@musics_blp.route("/proposals/<int:music_id>")
class ProposedMusicById(MethodView):
    """
    Resource for a specific proposed music
    """

    @musics_blp.response(200, ProposedMusicSchema)
    def get(self, music_id):
        """
        Get a specific proposed music
        """
        return {}

    @musics_blp.arguments(ProposedMusicSchema)
    @musics_blp.response(200, ProposedMusicSchema)
    def put(self, proposal, music_id):
        """
        Update a specific proposed music
        """
        return proposal

    @musics_blp.response(204)
    def delete(self, music_id):
        """
        Delete a specific proposed music
        """
        return None
