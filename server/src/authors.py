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
class Authors(MethodView):
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

    @authors_blp.arguments(AuthorSchema)
    @authors_blp.response(200, AuthorSchema)
    def put(self, author):
        """
        Update an author
        """
        return author
