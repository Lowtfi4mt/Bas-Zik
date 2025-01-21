import { useEffect, useState } from "preact/hooks";
import { API_URL } from "../../constants";
import { useParams, useNavigate } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import AlbumCard from "../../components/AlbumCard";

const Artist = () => {
    const [results, setResults] = useState(null);
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(API_URL + `authors/${id}`);
                const data = await response.json();
                setResults(data);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchResults();

    }, [id]);

    return (
        <div style={{ padding: "20px" }}>
            {
                results ? (
                    <div>
                        <button onClick={() => navigate(-1)}>Retour</button>
                        <h1>Page d&apos;artiste &bull; {results.name}</h1>
                        <h2>{results.albums.length} albums  &bull; {results.app_musics.length} titres</h2>
                        <h2>Albums</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {results.albums.map((album) => (
                                <AlbumCard key={album.id} album={album} />
                            ))}
                        </div>
                        <h2>Titres</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {results.app_musics.map((music) => (
                                <MusicCard key={music.id} music={{...music, albums: [{
                                    id: results.id,
                                    name: results.name
                                }], authors: results.authors}} />
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
