"""
This module contains the schemas for the music API
"""

from marshmallow import Schema, fields
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from models import AppMusic, MusicProposal, Author, Album


class BaseSchema(SQLAlchemyAutoSchema):
    """
    Base schema with default Meta configurations to reduce redundancy.
    """

    # pylint: disable=too-few-public-methods
    # pylint: disable=missing-class-docstring
    class Meta:
        load_instance = True
        include_relationships = False
        model = None  # Placeholder, to be overridden

    def __init_subclass__(cls, **kwargs):
        """
        Automatically assign the `model` attribute in Meta based on the child schema.
        """
        super().__init_subclass__(**kwargs)
        if not hasattr(cls, "model"):
            raise AttributeError(f"{cls.__name__} must define a `model` attribute.")
        if hasattr(cls, "Meta") and hasattr(cls, "model"):
            cls.Meta.model = cls.model


class AppMusicSchema(BaseSchema):
    """
    A schema for a music in the app
    """

    model = AppMusic
    authors = fields.List(Nested("NestedAuthorSchema"))
    albums = fields.List(Nested("NestedAlbumSchema"))


class MusicProposalSchema(BaseSchema):
    """
    A music schema for a music proposal from the community
    """

    model = MusicProposal
    authors = fields.List(Nested("NestedAuthorSchema"))
    albums = fields.List(Nested("NestedAlbumSchema"))


class AuthorSchema(BaseSchema):
    """
    A schema for the author of a song
    """

    model = Author
    app_musics = fields.List(fields.Nested("NestedAppMusicSchema"))
    musics_proposals = fields.List(fields.Nested("NestedMusicProposalSchema"))
    albums = fields.List(fields.Nested("NestedAlbumSchema"))


class AlbumSchema(BaseSchema):
    """
    A schema for the album of a song
    """

    model = Album
    app_musics = fields.List(fields.Nested("NestedAppMusicSchema"))
    musics_proposals = fields.List(fields.Nested("NestedMusicProposalSchema"))
    authors = fields.List(fields.Nested("NestedAuthorSchema"))


class NestedAppMusicSchema(BaseSchema):
    """
    A schema for a music in the app, meant to be used in nested fields
    """

    model = AppMusic
    authors = fields.List(Nested("NRAuthorSchema"))
    albums = fields.List(Nested("NRAlbumSchema"))


class NestedMusicProposalSchema(BaseSchema):
    """
    A music schema for a music proposal from the community, meant to be used in nested fields
    """

    model = MusicProposal
    authors = fields.List(Nested("NRAuthorSchema"))
    albums = fields.List(Nested("NRAlbumSchema"))


class NestedAuthorSchema(BaseSchema):
    """
    A schema for the author of a song, meant to be used in nested fields
    """

    model = Author
    app_musics = fields.List(Nested("NRAppMusicSchema"))
    musics_proposals = fields.List(Nested("NRMusicProposalSchema"))
    albums = fields.List(Nested("NRAlbumSchema"))


class NestedAlbumSchema(BaseSchema):
    """
    A schema for the album of a song, meant to be used in nested fields
    """

    model = Album
    app_musics = fields.List(Nested("NRAppMusicSchema"))
    musics_proposals = fields.List(Nested("NRMusicProposalSchema"))
    authors = fields.List(Nested("NRAuthorSchema"))


class NRAppMusicSchema(BaseSchema):
    """
    A schema for a music in the app, meant to be used at the end of nested fields
    """

    model = AppMusic


class NRMusicProposalSchema(BaseSchema):
    """
    A music schema for a music proposal from the community, meant to be used at the end of nested fields
    """

    model = MusicProposal


class NRAuthorSchema(BaseSchema):
    """
    A schema for the author of a song, meant to be used at the end of nested fields
    """

    model = Author


class NRAlbumSchema(BaseSchema):
    """
    A schema for the album of a song, meant to be used at the end of nested fields
    """

    model = Album


class SearchMusicSchema(BaseSchema):
    """
    A schema for a music in a search result
    """

    model = AppMusic


class SearchAuthorSchema(BaseSchema):
    """
    A schema for an author in a search result
    """

    model = Author
    # image path (REQUIRED)
    image_path = fields.String(required=True)


class SearchAlbumSchema(BaseSchema):
    """
    A schema for an album in a search result
    """

    model = Album
    image_path = fields.String(required=True)


class SearchResultSchema(Schema):
    """
    A schema for a search result
    Contains a list of authors, albums and musics
    """

    authors = fields.List(fields.Nested(SearchAuthorSchema))
    albums = fields.List(fields.Nested(SearchAlbumSchema))
    musics = fields.List(fields.Nested(SearchMusicSchema))
