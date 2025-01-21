import { useEffect, useState } from "preact/hooks";
import { API_URL } from "../../constants";
import { useSearchParams, useNavigate } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import AlbumCard from "../../components/AlbumCard";
import ArtistCard from "../../components/ArtistCard";

const SearchResults = () => {
    const [results, setResults] = useState(null);
    const [searchParams] = useSearchParams();
    const query = searchParams.get("query");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(API_URL + `search/${query}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchResults();

    }, [query]);

    return (
        <div style={{ padding: "20px" }}>
            {
                results ? (
                    <div>
                        <button onClick={() => navigate(-1)}>Retour</button>
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
                            {results.authors.map((artist) => (
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
