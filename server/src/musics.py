"""
Module for handling app musics and proposed musics
"""

import json
from flask_smorest import Blueprint
from flask.views import MethodView
from src.schemas import (
    AppMusicSchema,
    ProposedMusicSchema,
)
from src.models import *
from src.s3 import create_package_from_files, upload_package_to_s3
from src.utils import *
from flask import request

musics_blp = Blueprint(
    "musics",
    __name__,
    url_prefix="/musics",
    description="Operations on musics",
)


@musics_blp.route("/app")
class AppMusicResource(MethodView):
    """
    Resource for app musics
    """

    @musics_blp.response(200, AppMusicSchema(many=True))
    def get(self):
        """
        Get all musics in the app
        """
        return AppMusic.query.all()

    @musics_blp.response(201, AppMusicSchema)
    def post(self):

        package=create_package_from_files(request)
        print(package)
        #upload_package_to_s3(package)

        app_music_from_json_data = create_app_music_from_json(package.get('json'))

        db.session.add(app_music_from_json_data)
        db.session.commit()

        return app_music_from_json_data


@musics_blp.route("/app/<int:music_id>")
class AppMusicDetailResource(MethodView):
    """
    Resource for a specific app music
    """

    @musics_blp.response(200, AppMusicSchema)
    def get(self, music_id):
        """
        Get a specific app music
        """
        return AppMusic.query.get_or_404(music_id)

    @musics_blp.arguments(AppMusicSchema(session=db.session))
    @musics_blp.response(200, AppMusicSchema)
    def put(self, music, music_id):
        """
        Update a specific app music
        """
        music = AppMusic.query.get_or_404(music_id)
        music.update(music)
        db.session.commit()
        return music

    @musics_blp.response(204)
    def delete(self, music_id):
        """
        Delete a specific app music
        """
        music = AppMusic.query.get_or_404(music_id)
        db.session.delete(music)
        db.session.commit()
        return None


@musics_blp.route("/app/top/<int:top_count>")
class AppMusicTopResource(MethodView):
    """
    Resource for getting the top x app musics
    """

    @musics_blp.response(200, AppMusicSchema(many=True))
    def get(self, top_count):
        """
        Get the top x musics in the app
        """
        return AppMusic.query.order_by(AppMusic.likes.desc()).limit(top_count).all()


@musics_blp.route("/app/random/<int:random_count>")
class AppMusicRandomResource(MethodView):
    """
    Resource for getting random app musics
    """

    @musics_blp.response(200, AppMusicSchema(many=True))
    def get(self, random_count):
        """
        Get random musics from the app
        """
        return AppMusic.query.order_by(random()).limit(random_count).all()


@musics_blp.route("/proposals")
class ProposedMusicResource(MethodView):
    """
    Resource for proposed musics
    """

    @musics_blp.response(200, ProposedMusicSchema(many=True))
    def get(self):
        """
        Get all proposed musics
        """
        return ProposedMusic.query.all()

    @musics_blp.arguments(ProposedMusicSchema(session=db.session))
    @musics_blp.response(201, ProposedMusicSchema)
    def post(self, new_proposal):
        """
        Add a new music proposal
        """
        db.session.add(new_proposal)
        db.session.commit()
        return new_proposal


@musics_blp.route("/proposals/<int:music_id>")
class ProposedMusicDetailResource(MethodView):
    """
    Resource for a specific proposed music
    """

    @musics_blp.response(200, ProposedMusicSchema)
    def get(self, music_id):
        """
        Get a specific proposed music
        """
        return ProposedMusic.query.get_or_404(music_id)

    @musics_blp.arguments(ProposedMusicSchema(session=db.session))
    @musics_blp.response(200, ProposedMusicSchema)
    def put(self, proposal, music_id):
        """
        Update a specific proposed music
        """
        proposal = ProposedMusic.query.get_or_404(music_id)
        proposal.update(proposal)
        db.session.commit()
        return proposal

    @musics_blp.response(204)
    def delete(self, music_id):
        """
        Delete a specific proposed music
        """
        proposal = ProposedMusic.query.get_or_404(music_id)
        db.session.delete(proposal)
        db.session.commit()
        return None