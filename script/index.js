import fs from "fs";
import path from "path";
import { exec } from "child_process";
import Innertube from "youtubei.js";
import pLimit from "p-limit";

async function downloadPlaylist(playlistUrl) {
    try {
        const youtube2 = await Innertube.create();
        const playlistId = new URL(playlistUrl).searchParams.get("list");
        const playlist = await youtube2.music.getPlaylist(playlistId);

        const outputDir = "./output";
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        let downloadQueue = playlist.contents.filter(
            (music) => music.item_type === "song"
        );
        console.log(`Téléchargement de la playlist : ${playlist.header.title}`);

        const albumAssociation = {};
        const limit = pLimit(10);
        let index = 0;

        // Fonction pour traiter une musique
        const processMusic = async (music) => {
            const fileName = `${music.id}`;
            console.log(`Traitement de la musique : ${music.id} ${music.title}`);

            const audioFileInput = path.join(outputDir, `${fileName}.mp3`);
            const audioFile = path.join(outputDir, `${fileName}.ogg`);
            const thumbnailFile = path.join(outputDir, `${fileName}.jpg`);
            const metadataFile = path.join(outputDir, `${fileName}.json`);

            try {
                if (!fs.existsSync(audioFileInput)) {
                    await executeCommand(
                        `yt-dlp -x --audio-format mp3 -o \"${audioFileInput}\" https://music.youtube.com/watch?v=${music.id}`
                    );
                }

                let additionalInfo;
                if (!music.artists || !music?.thumbnail?.contents) {
                    additionalInfo = await youtube2.music.getInfo(music.id);
                }

                let thumbnailUrl = null;
                if (music?.thumbnail?.contents) {
                    thumbnailUrl = music.thumbnail.contents.reduce((smallest, current) => {
                        return current.width < smallest.width ? current : smallest;
                    }).url;
                }
                else {
                    thumbnailUrl = additionalInfo?.basic_info.thumbnail.reduce((smallest, current) => {
                        return current.width < smallest.width ? current : smallest;
                    }).url;
                }

                if (thumbnailUrl && !fs.existsSync(thumbnailFile)) {
                    await executeCommand(
                        `curl -o \"${thumbnailFile}\" \"${thumbnailUrl}\"`
                    );
                }

                if (!fs.existsSync(audioFile)) {
                    await executeCommand(
                        `ffmpeg -i \"${audioFileInput}\" -ac 1 -ar 8000 -c:a libvorbis -qscale:a 0 \"${audioFile}\"`
                    );
                }

                const metadata = {
                    title: music.title,
                    artists: music?.artists?.map((artist) => ({
                        name: artist.name,
                        id: artist.channel_id,
                    })) || [
                        {
                            name: additionalInfo?.basic_info.author,
                            id: additionalInfo?.basic_info.channel_id,
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

                if (music.album) {
                    const newAlbum = await youtube2.music.getAlbum(
                        music.album.id
                    );
                    const newSongs = newAlbum.contents.filter(
                        (music) => music.item_type === "song"
                    );

                    newSongs.forEach((song) => {
                        albumAssociation[song.id] = {
                            name: music.album.name,
                            id: music.album.id,
                        };
                    });

                    for (const newSong of newSongs) {
                        if (
                            !downloadQueue.some(
                                (song) => song.id === newSong.id
                            )
                        ) {
                            downloadQueue.push(newSong);
                            console.log(
                                `Ajout de ${newSong.title} à la file d'attente`
                            );
                        }
                    }
                }
            } catch (error) {
                console.error(`Erreur pour ${music.title} :`, error);
            } finally {
                index++;
                console.log(
                    `${index}/${downloadQueue.length} téléchargements terminés`
                );
            }
        };

        // Boucle pour traiter dynamiquement les musiques
        while (downloadQueue.length > 0) {
            const tasks = downloadQueue.splice(0, 10).map((music) =>
                limit(() => processMusic(music))
            );
            await Promise.all(tasks);
        }

        console.log(`Playlist téléchargée avec succès : ${playlist.header.title}`);
    } catch (error) {
        console.error("Erreur lors du téléchargement de la playlist :", error);
    }
}

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

const playlistUrl =
    "https://music.youtube.com/playlist?list=LRYRIylIuWRkOvpdDJkT_enRfVUInzzXUKo2b&si=jFMW7ydwbC5TiRTJ";
downloadPlaylist(playlistUrl);
