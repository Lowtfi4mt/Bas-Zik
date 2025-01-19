import { useEffect, useState } from "preact/hooks";
import { API_URL } from "../../constants";
import { useParams } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import AlbumCard from "../../components/AlbumCard";

const Artist = () => {
    const [results, setResults] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(API_URL + `authors/${id}`);
                const data = await response.json();
                setResults(data.results);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchResults();

        setResults({
            name: "Léo Ferré",
            albumCount: 5,
            musicCount: 152,
            musics: [
                {
                    title: "J'Avais Un Pense-Bête",
                    path: "public/-3hDYqy7KX4",
                    authors: ["Léo Ferré"],
                    authorsId: [56],
                    albums: ["Amour Anarchie"],
                    albumsId: [78],
                    duration: 185,
                    likes: 123,
                    id: 12
                },
                {
                    title: "One Last Game",
                    path: "public/-VmQ5jf3eyo",
                    authors: ["Blabla"],
                    authorsId: [56],
                    albums: ["Blibli"],
                    albumsId: [78],
                    duration: 642,
                    likes: 64,
                    id: 52
                }   
            ], albums: [
                {
                    title: "Amour Anarchie",
                    path: "public/0RURf-tNuOo", //Path d'une musique de l'album, sert à récup une image
                    authors: ["Giorgio Gee", "Trevor Guthrie"],
                    musicCount: 12, //Nombre de musiques dans l'album
                    authorsId: [56, 62],
                    id: 62
                }
            ]                
        });
    }, [id]);

    return (
        <div style={{ padding: "20px" }}>
            {
                results ? (
                    <div>
                        <h1>Page d&apos;artiste &bull; {results.name}</h1>
                        <h2>{results.albumCount} albums  &bull; {results.musicCount} titres</h2>
                        <h2>Albums</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {results.albums.map((album) => (
                                <AlbumCard key={album.id} album={album} />
                            ))}
                        </div>
                        <h2>Titres</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {results.musics.map((music) => (
                                <MusicCard key={music.id} music={music} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )
            }
        </div>
    );
};

export default Artist;
