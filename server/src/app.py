"""
Simple Flask API
"""

from flask import Flask
from flask.views import MethodView
from flask_smorest import Api, Blueprint
from marshmallow import Schema, fields

app = Flask(__name__)
app.config["API_TITLE"] = "My API"
app.config["API_VERSION"] = "v1"
app.config["OPENAPI_VERSION"] = "3.0.3"
app.config["OPENAPI_URL_PREFIX"] = "/docs"
app.config["OPENAPI_SWAGGER_UI_PATH"] = "/apidocs"
app.config["OPENAPI_SWAGGER_UI_URL"] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"

api = Api(app)

blp = Blueprint("items", __name__, url_prefix="/items", description="Items operations")


class ItemSchema(Schema):
    """
    This is a class docstring
    """

    id = fields.Int(
        required=True,
        description="The item ID",
        example=1,
    )
    name = fields.Str(
        required=True,
        description="The item name",
        example="My Item",
    )


@blp.route("/")
class ItemList(MethodView):
    """
    This is a class docstring
    """

    @blp.response(200, ItemSchema(many=True))
    def get(self):
        """Get all items"""
        print(app.url_map)
        return [{"id": 1, "name": "Item One"}, {"id": 2, "name": "Item Two"}]


api.register_blueprint(blp)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
