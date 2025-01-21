"""
This module contains the database models for the application.
"""

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


app_music_author = db.Table(
    "app_music_author",
    db.Column("music_id", db.Integer, db.ForeignKey("app_musics.id"), primary_key=True),
    db.Column("author_id", db.Integer, db.ForeignKey("authors.id"), primary_key=True),
)

app_music_album = db.Table(
    "app_music_album",
    db.Column("music_id", db.Integer, db.ForeignKey("app_musics.id"), primary_key=True),
    db.Column("album_id", db.Integer, db.ForeignKey("albums.id"), primary_key=True),
)

music_proposal_author = db.Table(
    "music_proposal_author",
    db.Column(
        "music_id", db.Integer, db.ForeignKey("proposed_musics.id"), primary_key=True
    ),
    db.Column("author_id", db.Integer, db.ForeignKey("authors.id"), primary_key=True),
)

music_proposal_album = db.Table(
    "music_proposal_album",
    db.Column(
        "music_id", db.Integer, db.ForeignKey("proposed_musics.id"), primary_key=True
    ),
    db.Column("album_id", db.Integer, db.ForeignKey("albums.id"), primary_key=True),
)

album_author = db.Table(
    "album_author",
    db.Column("album_id", db.Integer, db.ForeignKey("albums.id"), primary_key=True),
    db.Column("author_id", db.Integer, db.ForeignKey("authors.id"), primary_key=True),
)


class AppMusic(db.Model):
    """
    An app music model, inheriting from the base music model
    """

    __tablename__ = "app_musics"
    id = db.Column(
        db.Integer,
        primary_key=True,
        doc="The music ID",
    )
    title = db.Column(
        db.String(100),
        nullable=False,
        doc="The music title",
    )
    path = db.Column(
        db.String(200),
        nullable=False,
        doc="The path to the music file",
    )
    duration = db.Column(
        db.Integer,
        nullable=False,
        doc="The music duration in seconds",
    )
    likes = db.Column(
        db.Integer,
        default=0,
        doc="How many likes the music has",
    )

    authors = db.relationship(
        "Author", secondary=app_music_author, back_populates="app_musics"
    )
    albums = db.relationship(
        "Album", secondary=app_music_album, back_populates="app_musics"
    )


class MusicProposal(db.Model):
    """
    A proposed music model, inheriting from the base music model
    """

    __tablename__ = "proposed_musics"
    id = db.Column(
        db.Integer,
        primary_key=True,
        doc="The music ID",
    )
    title = db.Column(
        db.String(100),
        nullable=False,
        doc="The music title",
    )
    votes = db.Column(
        db.Integer,
        default=0,
        doc="How many votes the music has",
    )

    authors = db.relationship(
        "Author", secondary=music_proposal_author, back_populates="musics_proposals"
    )
    albums = db.relationship(
        "Album", secondary=music_proposal_album, back_populates="musics_proposals"
    )


class Author(db.Model):
    """
    An author model
    """

    __tablename__ = "authors"
    id = db.Column(
        db.Integer,
        primary_key=True,
        doc="The author ID",
    )
    name = db.Column(
        db.String(100),
        nullable=False,
        doc="The author name",
    )

    app_musics = db.relationship(
        "AppMusic", secondary=app_music_author, back_populates="authors"
    )
    musics_proposals = db.relationship(
        "MusicProposal", secondary=music_proposal_author, back_populates="authors"
    )
    albums = db.relationship("Album", secondary=album_author, back_populates="authors")


class Album(db.Model):
    """
    An album model
    """

    __tablename__ = "albums"
    id = db.Column(
        db.Integer,
        primary_key=True,
        doc="The album ID",
    )
    name = db.Column(
        db.String(100),
        nullable=False,
        doc="The album name",
    )

    app_musics = db.relationship(
        "AppMusic", secondary=app_music_album, back_populates="albums"
    )
    musics_proposals = db.relationship(
        "MusicProposal", secondary=music_proposal_album, back_populates="albums"
    )
    authors = db.relationship("Author", secondary=album_author, back_populates="albums")
