"""
Simple Flask API
"""

import random
from faker import Faker
from flask import Flask
from flask_smorest import Api
from musics import musics_blp
from authors import authors_blp
from albums import albums_blp
from models import db, Music, Author, Album

USE_MOCKS = True


def create_app() -> Flask:
    """
    Create the Flask app
    """
    app = Flask(__name__)
    app.config["API_TITLE"] = "My API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/docs"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/apidocs"
    app.config["OPENAPI_SWAGGER_UI_URL"] = (
        "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    )
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///database.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_ECHO"] = True

    api = Api(app)
    api.register_blueprint(musics_blp)
    api.register_blueprint(authors_blp)
    api.register_blueprint(albums_blp)

    db.init_app(app)
    with app.app_context():
        db.drop_all()
        db.create_all()

    if USE_MOCKS:
        create_mock_data(app)

    return app


def create_mock_data(app):
    """
    Create mock data for the app
    """
    with app.app_context():
        fake = Faker()

        # Generate authors
        for _ in range(10):
            author = Author(name=fake.name())
            db.session.add(author)

        # Generate albums
        for _ in range(10):
            album = Album(name=fake.sentence())
            db.session.add(album)

        db.session.commit()


if __name__ == "__main__":
    main_app = create_app()
    main_app.run(host="0.0.0.0", port=5000, debug=True)
