"""
This module contains the schemas for the music API
"""

from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from models import AppMusic, MusicProposal, Author, Album


class AppMusicSchema(SQLAlchemyAutoSchema):
    """
    A schema for a music in the app
    """

    class Meta:
        """Meta class for the schema"""

        model = AppMusic
        load_instance = True
        include_relationships = True


class MusicProposalSchema(SQLAlchemyAutoSchema):
    """
    A music schema for a music proposal from the community
    """

    class Meta:
        """Meta class for the schema"""

        model = MusicProposal
        load_instance = True
        include_relationships = True


class AuthorSchema(SQLAlchemyAutoSchema):
    """
    A schema for the author of a song
    """

    class Meta:
        """Meta class for the schema"""

        model = Author
        load_instance = True
        include_relationships = True


class AlbumSchema(SQLAlchemyAutoSchema):
    """
    A schema for the album of a song
    """

    class Meta:
        """Meta class for the schema"""

        model = Album
        load_instance = True
        include_relationships = True


class SearchResultSchema(Schema):
    """
    A schema for a search result
    Contains a list of authors, albums and musics
    """

    authors = fields.List(fields.Nested(AuthorSchema))
    albums = fields.List(fields.Nested(AlbumSchema))
    musics = fields.List(fields.Nested(AppMusicSchema))
