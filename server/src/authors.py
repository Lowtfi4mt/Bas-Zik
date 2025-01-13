"""
Module for handling authors
"""

from flask_smorest import Blueprint
from flask.views import MethodView
from schemas import AuthorSchema

authors_blp = Blueprint(
    "authors",
    __name__,
    url_prefix="/authors",
    description="Operations on authors",
)


@authors_blp.route("/")
class AuthorResource(MethodView):
    """
    Resource for authors
    """

    @authors_blp.response(200, AuthorSchema(many=True))
    def get(self):
        """
        Get all authors
        """
        return []

    @authors_blp.arguments(AuthorSchema)
    @authors_blp.response(201, AuthorSchema)
    def post(self, new_author):
        """
        Add a new author
        """
        return new_author


@authors_blp.route("/<int:author_id>")
class AuthorDetailResource(MethodView):
    """
    Resource for a specific author
    """

    @authors_blp.response(200, AuthorSchema)
    def get(self, author_id):
        """
        Get a specific author
        """
        return {"id": author_id, "name": "Author name"}

    @authors_blp.arguments(AuthorSchema)
    @authors_blp.response(200, AuthorSchema)
    def put(self, author, author_id):
        """
        Update a specific author
        """
        return author

    @authors_blp.response(204)
    def delete(self, author_id):
        """
        Delete a specific author
        """
        return None
