"""
This module contains the schemas for the music API
"""

from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from models import db, AppMusic, MusicProposal, Author, Album
from models import AppMusic, MusicProposal, Author, Album


class AppMusicSchema(SQLAlchemyAutoSchema):
    """
    A schema for a music in the app
    """

    authors = fields.List(Nested("NRAuthorSchema"))
    albums = fields.List(Nested("NRAlbumSchema"))

    class Meta:
        """Meta class for the schema"""

        model = AppMusic
        load_instance = True
        include_relationships = True


class MusicProposalSchema(SQLAlchemyAutoSchema):
    """
    A music schema for a music proposal from the community
    """

    authors = fields.List(Nested("NRAuthorSchema"))
    albums = fields.List(Nested("NRAlbumSchema"))

    class Meta:
        """Meta class for the schema"""

        model = MusicProposal
        load_instance = True
        include_relationships = True


class AuthorSchema(SQLAlchemyAutoSchema):
    """
    A schema for the author of a song
    """

    app_musics = fields.List(fields.Nested("NRAppMusicSchema"))
    musics_proposals = fields.List(fields.Nested("NRMusicProposalSchema"))
    albums = fields.List(fields.Nested("NRAlbumSchema"))

    class Meta:
        """Meta class for the schema"""

        model = Author
        load_instance = True
        include_relationships = True


class AlbumSchema(SQLAlchemyAutoSchema):
    """
    A schema for the album of a song
    """

    app_musics = fields.List(fields.Nested("NRAppMusicSchema"))
    musics_proposals = fields.List(fields.Nested("NRMusicProposalSchema"))
    authors = fields.List(fields.Nested("NRAuthorSchema"))

    class Meta:
        """Meta class for the schema"""

        model = Album
        load_instance = True
        include_relationships = True


class NRAppMusicSchema(SQLAlchemyAutoSchema):
    """
    A schema for a music in the app, meant to be used in nested fields
    """

    class Meta:
        """Meta class for the schema"""

        model = AppMusic
        load_instance = True
        include_relationships = False


class NRMusicProposalSchema(SQLAlchemyAutoSchema):
    """
    A music schema for a music proposal from the community, meant to be used in nested fields
    """

    class Meta:
        """Meta class for the schema"""

        model = MusicProposal
        load_instance = True
        include_relationships = False


class NRAuthorSchema(SQLAlchemyAutoSchema):
    """
    A schema for the author of a song, meant to be used in nested fields
    """

    class Meta:
        """Meta class for the schema"""

        model = Author
        load_instance = True
        include_relationships = False


class NRAlbumSchema(SQLAlchemyAutoSchema):
    """
    A schema for the album of a song, meant to be used in nested fields
    """

    class Meta:
        """Meta class for the schema"""

        model = Album
        load_instance = True
        include_relationships = False


class SearchResultSchema(Schema):
    """
    A schema for a search result
    Contains a list of authors, albums and musics
    """

    authors = fields.List(fields.Nested(AuthorSchema))
    albums = fields.List(fields.Nested(AlbumSchema))
    musics = fields.List(fields.Nested(AppMusicSchema))
