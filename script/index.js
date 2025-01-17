import fs from "fs";
import path from "path";
import { exec } from "child_process";
import Innertube from "youtubei.js";
import pLimit from "p-limit";

// Fonction principale pour télécharger tous les albums d'une liste d'artistes
async function downloadArtistsAlbums(artistIds) {
    try {
        const youtube2 = await Innertube.create();
        const outputDir = "./output";
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const limit = pLimit(10);
        let downloadQueue = [];
        let albumAssociation = {};
        let index = 0;

        console.log("Récupération des albums des artistes...");
        for (const artistId of artistIds) {
            const artist = await youtube2.music.getArtist(artistId);
            const albums =
                artist.sections
                    .filter((section) => section.type === "MusicCarouselShelf")
                    .flatMap((section) => section.contents)
                    .filter((item) => item.item_type === "album") || [];
            console.log(
                `Artiste : ${artist.header.title} - ${albums.length} albums trouvés`
            );

            for (const album of albums) {
                if (album.id) {
                    const fullAlbum = await youtube2.music.getAlbum(album.id);
                    const songs = fullAlbum.contents.filter(
                        (music) => music.item_type === "song"
                    );

                    for (const song of songs) {
                        if (
                            !downloadQueue.some(
                                (queued) => queued.id === song.id
                            )
                        ) {
                            downloadQueue.push(song);
                            console.log(
                                `Ajout de la musique : ${song.id} ${song.title} (${album.title.text})`
                            );
                            albumAssociation[song.id] = {
                                name: album.title.text,
                                id: album.id,
                            };
                        }
                    }
                }
            }
        }

        console.log(
            `Nombre total de musiques à télécharger : ${downloadQueue.length}`
        );

        // Fonction pour traiter une musique
        const processMusic = async (music) => {
            const fileName = `${music.id}`;
            console.log(
                `Traitement de la musique : ${music.id} ${music.title}`
            );

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
                    thumbnailUrl = music.thumbnail.contents.reduce(
                        (smallest, current) => {
                            return current.width < smallest.width
                                ? current
                                : smallest;
                        }
                    ).url;
                } else {
                    thumbnailUrl = additionalInfo?.basic_info.thumbnail.reduce(
                        (smallest, current) => {
                            return current.width < smallest.width
                                ? current
                                : smallest;
                        }
                    ).url;
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
                console.log(`Done ! (${music.id})`);
            } catch (error) {
                console.error(`Erreur pour ${music.title} :`, error);
            } finally {
                index++;
                console.log(
                    `${index}/${downloadQueue.length} téléchargements terminés`
                );
            }
        };

        // Traiter les musiques avec limite de tâches simultanées
        while (downloadQueue.length > 0) {
            const tasks = downloadQueue
                .splice(0, 10)
                .map((music) => limit(() => processMusic(music)));
            await Promise.all(tasks);
        }

        console.log("Téléchargement terminé !");
    } catch (error) {
        console.error("Erreur lors du téléchargement des albums :", error);
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

// Liste des IDs d'artistes à traiter
const artistIds = ["UC2RlJD_oh03i-wSSBnT_uxQ", "UC-PQxSt6dI531kkrJuK4VCg", "UC93q7WvkXEJBlk_QcO8aAuA", "UCEPMVbUzImPl4p8k4LkGevA", "UCIaFw5VBEK8qaW6nRpx_qnw", "UCvWtix2TtWGe9kffqnwdaMw", "UCqjWVWUmUEIPGOCt-3PHNyA", "UChgvDdOfB3f6KnEX4h4uIzw", "UC7JGA3rY8kb0-Epuqenjkzw", "UC3qNGDkJ7cvJe3F7dOA6WPA", "UCZuZrDSHhCk6_n4_IT9GIYA", "UCFQOPtpfr0UIkV-gOUQR5Xg", "UCiUGe6-wLSiiY1W1oiw3NHA", "UCQ1Xqlk89CLZ9aAFyo-1THg", "UCx9LqEV13eYe1qIez7mfMYw", "UCb86NexJdLdfmCCD7YIcgzQ", "UCIbOaMN8RUS5nfhZqmKhtFA", "UCmr7Hua3EW312rS5HSvoQFA"];
downloadArtistsAlbums(artistIds);
