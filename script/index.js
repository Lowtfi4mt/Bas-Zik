import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { Client, MusicClient } from 'youtubei';
import Innertube from 'youtubei.js';

// Fonction principale pour télécharger une playlist
async function downloadPlaylist(playlistUrl) {
    try {
        // Initialisation de youtubei
        const youtube = new Client();
        const youtube2 = await Innertube.create();
        const musicClient = new MusicClient();

        const playlistId = new URL(playlistUrl).searchParams.get('list');
        const playlist = await youtube.getPlaylist(playlistId);

        //console.log("playlist", playlist);

        const outputDir = './output'

        // Créer le dossier de sortie
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        console.log(`Téléchargement de la playlist : ${playlist.title}`);

        let index = 0;

        for (const video of playlist.videos) {
            const musicResult = await musicClient.search(video.title, "song");

            if (musicResult.length === 0) {
                console.error(`Aucun résultat pour ${video.title}`);
                continue;
            }

            const music = musicResult.items[0];
            //console.log("music", music);

            const fileName = `${music.id}`;

            console.log(`\\nTraitement de la musique : ${music.title}`);

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
                }
                else {
                    await executeCommand(`yt-dlp -x --audio-format mp3 -o \"${audioFileInput}\" https://music.youtube.com/watch?v=${music.id}`);
                }
                process.stdout.write("Thumbnail...   ");
                // Télécharger la miniature
                if (fs.existsSync(thumbnailFile)) {
                    process.stdout.write("Skipped...   ");
                }
                else {
                    const thumbnailUrl = music.thumbnails[0].url;
                    await executeCommand(`curl -o \"${thumbnailFile}\" \"${thumbnailUrl}\"`);    
                }
                process.stdout.write("Convert...   ");
                // Convertir en Ogg Vorbis avec ffmpeg

                if (fs.existsSync(audioFile)) {
                    process.stdout.write("Skipped...   ");
                }
                else {
                    await executeCommand(`ffmpeg -i \"${audioFileInput}\" -ac 1 -ar 8000 -c:a libvorbis -qscale:a 0 \"${audioFile}\"`);
                }
                process.stdout.write("Metadata...   ");
                // Sauvegarder les métadonnées
                const metadata = {
                    title: music.title,
                    artist: music.artists.map(artist => {return {
                        name: artist.name,
                        id: artist.id,
                    }}),
                    album: {
                        name: music.album.title,
                        id: music.album.id,
                    },
                    duration: music.duration,
                };
                fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
                console.log("Done !");
                index++;

                console.log("détail de l'album", await youtube2.music.getAlbum(music.album.id));

                console.log(`${index}/${playlist.videos.length} Téléchargement réussi : ${music.title}`);
            } catch (error) {
                console.error(`Erreur pour ${music.title} :`, error);
            }
        }

        console.log(`\\nPlaylist téléchargée avec succès : ${playlist.title}`);
    } catch (error) {
        console.error('Erreur lors du téléchargement de la playlist :', error);
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

// Exemple d'utilisation
const playlistUrl = 'https://music.youtube.com/playlist?list=RDCLAK5uy_mn6mX0GYERCgJxFbmlSXE8Vxqhafy1VoY';
downloadPlaylist(playlistUrl);
