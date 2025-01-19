import { useEffect, useState } from "preact/hooks";
import { API_URL } from "../../constants";
import { useSearchParams } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import AlbumCard from "../../components/AlbumCard";
import ArtistCard from "../../components/ArtistCard";

const SearchResults = () => {
    const [results, setResults] = useState(null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(API_URL + `search/${query}`);
                const data = await response.json();
                setResults(data.results);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchResults();

        setResults({
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
            ], artists: [
                {
                    name: "Léo Ferré",
                    id: 5,
                    albumCount: 5,
                    musicCount: 152,
                    path: "public/0IX090ajmI0" //Path d'une musique de l'artiste, sert à récup une image
                }
            ]
                
        });
    }, [query]);

    return (
        <div style={{ padding: "20px" }}>
            {
                results ? (
                    <div>
                        <h1>Résultats de la recherche pour &apos;{query}&apos;</h1>
                        <h2>Titres</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {results.musics.map((music) => (
                                <MusicCard key={music.id} music={music} />
                            ))}
                        </div>
                        <h2>Albums</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {results.albums.map((album) => (
                                <AlbumCard key={album.id} album={album} />
                            ))}
                        </div>
                        <h2>Artistes</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {results.artists.map((artist) => (
                                <ArtistCard key={artist.id} artist={artist} />
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

export default SearchResults;
