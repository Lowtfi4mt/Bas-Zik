"""
Module for handling app musics
"""

from flask_smorest import Blueprint
from flask import request
from flask.views import MethodView
from sqlalchemy.sql.functions import random

from schemas import AppMusicSchema
from models import db, AppMusic
from s3 import create_package_from_files, upload_package_to_s3
from utils import create_app_music_from_json


UPLOAD_TO_S3 = False

app_musics_blp = Blueprint(
    "app_musics",
    __name__,
    url_prefix="/musics/app",
    description="Operations on musics",
)


@app_musics_blp.route("/")
class AppMusicResource(MethodView):
    """
    Resource for app musics
    """

    @app_musics_blp.response(200, AppMusicSchema(many=True))
    def get(self):
        """
        Get all musics in the app
        """
        return AppMusic.query.all()

    @app_musics_blp.response(201, AppMusicSchema)
    def post(self):
        """
        Add a new music to the app
        """
        package = create_package_from_files(request)
        print(package)
        if UPLOAD_TO_S3:
            upload_package_to_s3(package)

        app_music_from_json_data = create_app_music_from_json(package.get("json"))

        db.session.add(app_music_from_json_data)
        db.session.commit()

        return app_music_from_json_data


@app_musics_blp.route("/<int:music_id>")
class AppMusicDetailResource(MethodView):
    """
    Resource for a specific app music
    """

    @app_musics_blp.response(200, AppMusicSchema)
    def get(self, music_id):
        """
        Get a specific app music
        """
        return AppMusic.query.get_or_404(music_id)

    @app_musics_blp.arguments(AppMusicSchema(session=db.session))
    @app_musics_blp.response(200, AppMusicSchema)
    def put(self, music, music_id):
        """
        Update a specific app music
        """
        music = AppMusic.query.get_or_404(music_id)
        music.update(music)
        db.session.commit()
        return music

    @app_musics_blp.response(204)
    def delete(self, music_id):
        """
        Delete a specific app music
        """
        music = AppMusic.query.get_or_404(music_id)
        db.session.delete(music)
        db.session.commit()
        return None


@app_musics_blp.route("/<int:music_id>/like")
class AppMusicLikeResource(MethodView):
    """
    Resource for liking an app music
    """

    @app_musics_blp.response(200, AppMusicSchema)
    def put(self, music_id):
        """
        Like an app music
        """
        music = AppMusic.query.get_or_404(music_id)
        music.likes += 1
        db.session.commit()
        return music


@app_musics_blp.route("/<int:music_id>/unlike")
class AppMusicUnlikeResource(MethodView):
    """
    Resource for unliking an app music
    """

    @app_musics_blp.response(200, AppMusicSchema)
    def put(self, music_id):
        """
        Unlike an app music
        """
        music = AppMusic.query.get_or_404(music_id)
        music.likes -= 1
        db.session.commit()
        return music


@app_musics_blp.route("/top/<int:top_count>")
class AppMusicTopResource(MethodView):
    """
    Resource for getting the top x app musics
    """

    @app_musics_blp.response(200, AppMusicSchema(many=True))
    def get(self, top_count):
        """
        Get the top x musics in the app
        """
        return AppMusic.query.order_by(AppMusic.likes.desc()).limit(top_count).all()


@app_musics_blp.route("/random/<int:random_count>")
class AppMusicRandomResource(MethodView):
    """
    Resource for getting random app musics
    """

    @app_musics_blp.response(200, AppMusicSchema(many=True))
    def get(self, random_count):
        """
        Get random musics from the app
        """
        return AppMusic.query.order_by(random()).limit(random_count).all()
