"""
This module contains the schemas for the music API
"""

from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field
from models import Music


class MusicSchema(SQLAlchemyAutoSchema):
    """
    A schema for a base music, not meant to be used directly
    """

    class Meta:
        model = Music
        load_instance = True
        include_relationships = True

    type = auto_field(dump_only=True)


class AppMusicSchema(SQLAlchemyAutoSchema):
    """
    A schema for a music in the app
    """

    class Meta:
        model = Music
        exclude = ("type",)


class ProposedMusicSchema(SQLAlchemyAutoSchema):
    """
    A music schema for a music proposal from the community
    """

    class Meta:
        model = Music
        exclude = ("type",)


class AuthorSchema(SQLAlchemyAutoSchema):
    """
    A schema for the author of a song
    """

    class Meta:
        model = Music
        load_instance = True
        include_relationships = True


class AlbumSchema(SQLAlchemyAutoSchema):
    """
    A schema for the album of a song
    """

    class Meta:
        model = Music
        load_instance = True
        include_relationships = True
