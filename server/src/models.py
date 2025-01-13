"""
This module contains the database models for the application.
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


music_author = db.Table(
    "music_author",
    db.Column("music_id", db.Integer, db.ForeignKey("musics.id"), primary_key=True),
    db.Column("author_id", db.Integer, db.ForeignKey("authors.id"), primary_key=True),
)

music_album = db.Table(
    "music_album",
    db.Column("music_id", db.Integer, db.ForeignKey("musics.id"), primary_key=True),
    db.Column("album_id", db.Integer, db.ForeignKey("albums.id"), primary_key=True),
)


class Music(db.Model):
    """
    A base music model
    """

    __tablename__ = "musics"
    id = db.Column(db.Integer, primary_key=True, doc="The music ID")
    title = db.Column(db.String(100), nullable=False, doc="The music title")
    type = db.Column(
        db.String(50),
        nullable=False,
        doc="Internal discriminator for joined table inheritance, hidden from frontend",
    )

    # Relationships
    authors = db.relationship("Author", secondary=music_author, back_populates="musics")
    albums = db.relationship("Album", secondary=music_album, back_populates="musics")

    __mapper_args__ = {
        "polymorphic_identity": "base_music",
        "polymorphic_on": type,
    }


class AppMusic(Music):
    """
    An app music model, inheriting from the base music model
    """

    __tablename__ = "app_musics"
    id = db.Column(db.Integer, db.ForeignKey("musics.id"), primary_key=True)
    path = db.Column(db.String(200), doc="The path to the music file")
    duration = db.Column(db.Integer, doc="The music duration in seconds")
    likes = db.Column(db.Integer, doc="How many likes the music has")

    __mapper_args__ = {
        "polymorphic_identity": "app_music",
    }


class ProposedMusic(Music):
    """
    A proposed music model, inheriting from the base music model
    """

    __tablename__ = "proposed_musics"
    id = db.Column(db.Integer, db.ForeignKey("musics.id"), primary_key=True)
    votes = db.Column(db.Integer, doc="How many votes the music has")

    __mapper_args__ = {
        "polymorphic_identity": "proposed_music",
    }


class Author(db.Model):
    """
    An author model
    """

    __tablename__ = "authors"
    id = db.Column(db.Integer, primary_key=True, doc="The author ID")
    name = db.Column(db.String(100), nullable=False, doc="The author name")

    musics = db.relationship("Music", secondary=music_author, back_populates="authors")


class Album(db.Model):
    """
    An album model
    """

    __tablename__ = "albums"
    id = db.Column(db.Integer, primary_key=True, doc="The album ID")
    name = db.Column(db.String(100), nullable=False, doc="The album name")

    musics = db.relationship("Music", secondary=music_album, back_populates="albums")
