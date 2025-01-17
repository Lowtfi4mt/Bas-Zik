"""
Simple Flask API
"""

from flask import Flask
from flask_smorest import Api
from src.musics import musics_blp
from src.authors import authors_blp
from src.albums import albums_blp
from src.models import db
from src.s3 import s3_blp
from src.utils import process_s3_bucket

CREATE_DB_FROM_ZERO = True

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
    api.register_blueprint(s3_blp)

    db.init_app(app)

    if CREATE_DB_FROM_ZERO:
        with app.app_context():
            db.create_all()
            try:
                process_s3_bucket(app)
            except Exception as e:
                print(f"Error processing S3 bucket: {e}")


    return app

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
