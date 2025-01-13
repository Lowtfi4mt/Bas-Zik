"""
Simple Flask API
"""

from flask import Flask
from flask_smorest import Api
from musics import musics_blp
from authors import authors_blp


def create_app():
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

    api = Api(app)
    api.register_blueprint(musics_blp)
    api.register_blueprint(authors_blp)

    return app


if __name__ == "__main__":
    main_app = create_app()
    main_app.run(host="0.0.0.0", port=5000, debug=True)
