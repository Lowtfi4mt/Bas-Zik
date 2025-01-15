import fs from "fs";
import path from "path";
import { exec } from "child_process";
import Innertube from "youtubei.js";

// Fonction principale pour télécharger une playlist
async function downloadPlaylist(playlistUrl) {
    try {
        // Initialisation de youtubei
        const youtube2 = await Innertube.create();

        const playlistId = new URL(playlistUrl).searchParams.get("list");
        const playlist = await youtube2.music.getPlaylist(playlistId);

        const outputDir = "./output";

        // Créer le dossier de sortie
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        let downloadQueue = playlist.contents.filter(
            (music) => music.item_type === "song"
        );

        console.log(`Téléchargement de la playlist : ${playlist.header.title}`);

        let index = 0;
        let albumAssociation = {};

        for (const music of downloadQueue) {
            const fileName = `${music.id}`;

            console.log(`Traitement de la musique : ${music.id} ${music.title}`);

            // Chemins des fichiers
            const audioFileInput = path.join(outputDir, `${fileName}.mp3`);
            const audioFile = path.join(outputDir, `${fileName}.ogg`);
            const thumbnailFile = path.join(outputDir, `${fileName}.jpg`);
            const metadataFile = path.join(outputDir, `${fileName}.json`);

            try {
                process.stdout.write("Download...   ");
                // Télécharger l'audio avec yt-dlp
                if (fs.existsSync(audioFileInput)) {
                    process.stdout.write("Skipped...   ");
                } else {
                    await executeCommand(
                        `yt-dlp -x --audio-format mp3 -o \"${audioFileInput}\" https://music.youtube.com/watch?v=${music.id}`
                    );
                }

                let additionalInfo;
                if (!music.artists || !music?.thumbnail?.contents) {
                    additionalInfo = await youtube2.music.getInfo(music.id);
                    //console.log("thumb", additionalInfo.basic_info.thumbnail)
                }

                process.stdout.write("Thumbnail...   ");
                // Télécharger la miniature
                const thumbnailUrl =
                    music?.thumbnail?.contents?.[0]?.url ||
                    additionalInfo.basic_info.thumbnail[
                        additionalInfo.basic_info.thumbnail.length - 1
                    ].url;
                if (fs.existsSync(thumbnailFile) || !thumbnailUrl) {
                    process.stdout.write("Skipped...   ");
                } else {
                    await executeCommand(
                        `curl -o \"${thumbnailFile}\" \"${thumbnailUrl}\"`
                    );
                }
                process.stdout.write("Convert...   ");
                // Convertir en Ogg Vorbis avec ffmpeg

                if (fs.existsSync(audioFile)) {
                    process.stdout.write("Skipped...   ");
                } else {
                    await executeCommand(
                        `ffmpeg -i \"${audioFileInput}\" -ac 1 -ar 8000 -c:a libvorbis -qscale:a 0 \"${audioFile}\"`
                    );
                }
                process.stdout.write("Metadata...   ");
                // Sauvegarder les métadonnées
                const metadata = {
                    title: music.title,
                    artists: music?.artists?.map((artist) => {
                        return {
                            name: artist.name,
                            id: artist.channel_id,
                        };
                    }) || [
                        {
                            name: additionalInfo.basic_info.author,
                            id: additionalInfo.basic_info.channel_id,
                        },
                    ],
                    album: music.album
                        ? {
                              name: music.album.name,
                              id: music.album.id,
                          }
                        : albumAssociation[music.id],
                    duration: music.duration,
                };
                fs.writeFileSync(
                    metadataFile,
                    JSON.stringify(metadata, null, 2)
                );
                console.log("Done !");
                index++;

                if (music.album) {
                    const newAlbum = await youtube2.music.getAlbum(
                        music.album.id
                    );
                    //console.log("album", newAlbum, newAlbum.header.thumbnail.contents)

                    // const newAlbumThumbnailUrl = newAlbum.header.thumbnail.contents[0].url;
                    // const thumbnailAlbumFile = path.join(outputDir, `${music.album.id}.jpg`);
                    // if (fs.existsSync(thumbnailAlbumFile)) {
                    //     process.stdout.write("Skipped...   ");
                    // }
                    // else {
                    //     await executeCommand(`curl -o \"${thumbnailAlbumFile}\" \"${newAlbumThumbnailUrl}\"`);
                    //     console.log("Thumbnail album téléchargée")
                    // }

                    const newSongs = newAlbum.contents.filter(
                        (music) => music.item_type === "song"
                    );
                    newSongs.forEach((song) => {
                        albumAssociation[song.id] = {
                            name: music.album.name,
                            id: music.album.id,
                        };
                    });
                    let numberAdded = 0;
                    for (const newSong of newSongs) {
                        if (
                            !downloadQueue.some(
                                (song) => song.id === newSong.id
                            )
                        ) {
                            downloadQueue.push(newSong);
                            process.stdout.write(newSong.title + ",");
                            numberAdded++;
                        }
                    }
                    console.log("");
                    console.log(
                        `Ajout de ${numberAdded} musiques à télécharger`
                    );
                }
                console.log(
                    `${index}/${downloadQueue.length} Téléchargement réussi : ${music.title}`
                );
            } catch (error) {
                console.log(music);
                console.error(`Erreur pour ${music.title} :`, error);
            }
        }

        console.log(`Playlist téléchargée avec succès : ${playlist.title}`);
    } catch (error) {
        console.error("Erreur lors du téléchargement de la playlist :", error);
    }
}

// Fonction pour exécuter une commande système
function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(error);
            }
            resolve(stdout || stderr);
        });
    });
}

// URL de la playlist de base

const playlistUrl =
    "https://music.youtube.com/playlist?list=RDCLAK5uy_mn6mX0GYERCgJxFbmlSXE8Vxqhafy1VoY";
downloadPlaylist(playlistUrl);
