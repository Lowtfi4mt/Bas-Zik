"""
Module for handling authors
"""

from flask_smorest import Blueprint
from flask.views import MethodView
from schemas import AuthorSchema
from models import db, Author

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
        return Author.query.all()

    @authors_blp.arguments(AuthorSchema(session=db.session))
    @authors_blp.response(201, AuthorSchema)
    def post(self, new_author):
        """
        Add a new author
        """
        db.session.add(new_author)
        db.session.commit()
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
        return Author.query.get_or_404(author_id)

    @authors_blp.arguments(AuthorSchema(session=db.session))
    @authors_blp.response(200, AuthorSchema)
    def put(self, author, author_id):
        """
        Update a specific author
        """
        author = Author.query.get_or_404(author_id)
        author.update(author)
        db.session.commit()
        return author

    @authors_blp.response(204)
    def delete(self, author_id):
        """
        Delete a specific author
        """
        author = Author.query.get_or_404(author_id)
        db.session.delete(author)
        db.session.commit()
        return None
