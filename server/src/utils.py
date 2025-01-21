"""
Utility functions for processing JSON files and S3 buckets
"""

from os import environ as env
import logging
import json

from dotenv import load_dotenv
from tqdm_loggable.auto import tqdm

from models import db, AppMusic, Album, Author
from s3 import s3_client, BUCKET_NAME


load_dotenv()

is_logging_enabled = env.get("CREATE_DB_FROM_ZERO", "False").lower() == "true"

if is_logging_enabled:
    logging.basicConfig(level=logging.INFO)


def create_app_music_from_json(file):
    """
    Create an AppMusic instance from a JSON file
    """
    try:
        json_data = json.load(file)

        title = json_data.get("title")
        path = json_data.get("path")
        duration = json_data.get("duration", {}).get("seconds", 0)
        likes = json_data.get("likes")

        if not title:
            raise ValueError("Missing required field: 'title' must be provided.")

        return AppMusic(
            title=title,
            path=path or "",
            duration=duration or 0,
            likes=likes or 0,
        )
    # pylint: disable=broad-except
    except Exception as e:
        print(f"Error creating AppMusic instance: {e}")
        return None


def insert_music_from_json(json_data, base_name):
    """
    Insert music data into the database from a JSON file
    """

    # Extracting information
    title = json_data.get("title")
    artists_data = json_data.get("artists", [])
    album_data = json_data.get("album", {})
    duration = json_data.get("duration", {}).get("seconds", 0)

    # Ensure required fields are present
    if not title or not artists_data or not album_data:
        return {"error": "Missing required data fields"}

    # Insert the app music in the correct model
    app_music = AppMusic(
        title=title,
        duration=duration,
        path=f"{base_name}",
    )
    db.session.add(app_music)

    # Check if the album exists
    album_name = album_data.get("name")
    album = Album.query.filter_by(name=album_name).first()
    if not album:
        album = Album(name=album_name)
        db.session.add(album)
    album.app_musics.append(app_music)

    # Check if the authors exist, if not create them
    for artist in artists_data:
        author_name = artist.get("name")
        author = Author.query.filter_by(name=author_name).first()
        if not author:
            author = Author(name=author_name)
            db.session.add(author)
        author.app_musics.append(app_music)
        if album not in author.albums:
            author.albums.append(album)

    # Commit transaction
    db.session.commit()

    return {"message": f"Music '{title}' inserted successfully!"}


def process_s3_bucket(app):
    try:
        json_files = list_json_files_in_s3()
        progress_bar = tqdm(
            json_files,
            desc="Processing files",
            leave=True,
            dynamic_ncols=True,
            unit="file",
        )

        for json_file in progress_bar:
            base_name = json_file.rsplit(".", 1)[0]

            json_object = s3_client.get_object(Bucket=BUCKET_NAME, Key=json_file)
            json_data = json.load(json_object["Body"])

            insert_music_from_json(json_data, base_name)
            progress_bar.set_description(f"Processing {json_file}")

    except Exception as e:
        print(f"Error: {e}")


def list_json_files_in_s3():
    continuation_token = None
    json_files = []

    while True:
        print("Listing files from S3...")
        list_kwargs = {
            "Bucket": BUCKET_NAME,
        }
        if continuation_token:
            list_kwargs["ContinuationToken"] = continuation_token

        response = s3_client.list_objects_v2(**list_kwargs)

        if "Contents" in response:
            for obj in response["Contents"]:
                if obj["Key"].endswith(".json"):
                    json_files.append(obj["Key"])

        if response.get("IsTruncated"):
            continuation_token = response.get("NextContinuationToken")
        else:
            break

    return json_files
