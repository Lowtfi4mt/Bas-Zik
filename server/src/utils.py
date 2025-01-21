"""
Utility functions for processing JSON files and S3 buckets
"""

import json
from models import db, AppMusic, Album, Author
from s3 import s3_client, BUCKET_NAME


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

    # Check if the album exists
    album_name = album_data.get("name")
    album = Album.query.filter_by(name=album_name).first()
    if not album:
        album = Album(name=album_name)
        db.session.add(album)

    # Check if the authors exist, if not create them
    authors = []
    for artist in artists_data:
        author_name = artist.get("name")
        author = Author.query.filter_by(name=author_name).first()
        if not author:
            author = Author(name=author_name)
            db.session.add(author)
        authors.append(author)

    # If it's an app music, insert it in the correct model
    app_music = AppMusic(
        title=title,
        duration=duration,
        path=f"{base_name}",
        authors=authors,
        albums=[album],
    )
    db.session.add(app_music)

    # Commit transaction
    db.session.commit()

    return {"message": f"Music '{title}' inserted successfully!"}


def process_s3_bucket(app):
    """
    Process the S3 bucket, downloading and inserting music data into the database
    """
    try:
        # List all objects in the S3 bucket
        response = s3_client.list_objects_v2(Bucket=BUCKET_NAME)
        if "Contents" not in response:
            print("No files found in the bucket.")
            return

        files = response["Contents"]
        json_files = [file["Key"] for file in files if file["Key"].endswith(".json")]

        for json_file in json_files:
            base_name = json_file.rsplit(".", 1)[0]  # Remove the extension

            # Download and process the JSON file
            json_object = s3_client.get_object(Bucket=BUCKET_NAME, Key=json_file)
            json_data = json.load(json_object["Body"])

            # Insert data into the database
            with app.app_context():
                result = insert_music_from_json(json_data, base_name)
                print(result)

    # pylint: disable=broad-except
    except Exception as e:
        print(f"Error processing S3 bucket: {e}")
