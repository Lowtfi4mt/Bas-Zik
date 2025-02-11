"""
Simple Flask API
"""

from os import environ as env
from pathlib import Path

from dotenv import find_dotenv
from flask import Flask
from flask_smorest import Api
from flask_cors import CORS

from app_musics import app_musics_blp
from musics_proposals import musics_proposals_blp
from authors import authors_blp
from albums import albums_blp
from models import db
from search import search_blp
from utils import process_s3_bucket


find_dotenv()
CREATE_DB_FROM_ZERO: bool = env.get("CREATE_DB_FROM_ZERO", "False").lower() == "true"


def create_app() -> Flask:
    """
    Create the Flask app
    """
    app = Flask(__name__)
    CORS(app)
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
    app.config["SQLALCHEMY_ECHO"] = False

    api = Api(app)
    api.register_blueprint(app_musics_blp)
    api.register_blueprint(musics_proposals_blp)
    api.register_blueprint(authors_blp)
    api.register_blueprint(albums_blp)
    api.register_blueprint(search_blp)

    db.init_app(app)

    if CREATE_DB_FROM_ZERO:
        print("Creating database from zero")
        with app.app_context():
            print("Creating database from zero")
            database_path = Path("__file__").parent / "instance" / "database.db"
            if database_path.exists():
                database_path.unlink()
            db.create_all()
            try:
                process_s3_bucket(app)
            # pylint: disable=broad-except
            except Exception as e:
                print(f"Error processing S3 bucket: {e}")

    return app


if __name__ == "__main__":
    flask_app = create_app()
    flask_app.run(host="0.0.0.0", port=5000, debug=True)


if __name__ != "__main__":
    print("Creating app")
    flask_app = create_app()
