from flask_smorest import Blueprint
from flask import Flask, Request, request, jsonify, send_file
import boto3
import os
from io import BytesIO
from dotenv import load_dotenv, find_dotenv


s3_blp = Blueprint(
    "s3",
    __name__,
    url_prefix="/s3",
    description="Operations on S3",
)

dotenv_path = find_dotenv()
load_dotenv(dotenv_path)

ACCESS_KEY = os.getenv("ACCESS_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")
ENDPOINT_URL = os.getenv("ENDPOINT_URL")
REGION_NAME = os.getenv("REGION_NAME")
BUCKET_NAME = os.getenv("BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    endpoint_url=ENDPOINT_URL,
    region_name=REGION_NAME,
)

ALLOWED_EXTENSIONS = {"mp3", "wav", "flac"}


def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


"""
curl --location 'http://127.0.0.1:5000/s3/upload-files' \
--form 'music=@"postman-cloud:///1efd3546-70af-4660-8d3b-9babdeac94e6"' \
--form 'json=@"postman-cloud:///1efd3546-29aa-43f0-8423-b82b1b728672"' \
--form 'image=@"postman-cloud:///1efd3546-2a04-4940-9ce8-6fdadaa9916e"'
"""


@s3_blp.route("/upload-files", methods=["POST"])
def upload_files():
    package = create_package_from_files(request)
    upload_package_to_s3(package)
    return jsonify({"message": "File uploaded successfully", "file_url": "files"}), 200


# curl -X GET http://127.0.0.1:5000/s3/list-files
@s3_blp.route("/list-files", methods=["GET"])
def list_files():
    return s3_client.list_objects_v2(Bucket=BUCKET_NAME), 200


# curl -X GET "http://127.0.0.1:5000/s3/download-file?file_key=xxx0001" --output spinning-head-271171.mp3
@s3_blp.route("/download-file", methods=["GET"])
def download_file():
    file_key = request.args.get("file_key")
    if not file_key:
        return jsonify({"error": "File key not provided"}), 400

    try:
        # Fetch the object from S3-compatible storage
        response = s3_client.get_object(Bucket=BUCKET_NAME, Key=file_key)

        # Read the file content
        file_data = response["Body"].read()

        # Prepare the file for download
        file_stream = BytesIO(file_data)
        file_stream.seek(0)

        # Return the file as a downloadable response
        return send_file(
            file_stream,
            mimetype=response["ContentType"],
            as_attachment=True,
            download_name=file_key.split("/")[-1],  # Use the file name from the key
        )
    except:
        raise Exception


def create_package_from_files(request: Request) -> dict:
    music = request.files["music"]
    json = request.files["json"]
    image = request.files["image"]

    if json is None:
        return {"message": "Json not detected, skipped!"}, 200
    json_base_filename = json.filename.rsplit(".", 1)[0]
    if music:
        music_extension = music.filename.rsplit(".", 1)[-1]
        music.filename = f"{json_base_filename}.{music_extension}"
    if image:
        image_extension = image.filename.rsplit(".", 1)[-1]
        image.filename = f"{json_base_filename}.{image_extension}"
    return {"music": music, "json": json, "image": image}


def upload_package_to_s3(package: dict):
    for key, file in package.items():
        s3_client.upload_fileobj(
            file,
            BUCKET_NAME,
            file.filename,
            ExtraArgs={"ContentType": file.content_type},
        )
