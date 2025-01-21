import { useEffect, useState } from "preact/hooks";
import { API_URL } from "../../constants";
import { useParams, useNavigate } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import AlbumCard from "../../components/AlbumCard";
import './style.css';
import ArtistCard from "../../components/ArtistCard";

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
        <div className="search-results-page">
            <button className="return-search-button" onClick={() => navigate(-1)}>Retour</button>
            {
                results ? (
                    <>
                        <ArtistCard artist={results} />
                        <div className="search-results">
                            <details open>
                                <summary>
                                    Albums
                                </summary>
                                <div className="div-artist-collaps" style={{ display: "flex", flexDirection: "column" }}>
                                    {results.albums.map((album) => (
                                        <AlbumCard key={album.id} album={album} />
                                    ))}
                                </div>
                            </details>
                            <details open>
                                <summary>
                                    Titres
                                </summary>
                                <div className="div-artist-collaps" style={{ display: "flex", flexDirection: "column" }}>
                                    {results.app_musics.map((music) => (
                                        <MusicCard key={music.id} music={music} />
                                    ))}
                                </div>
                            </details>
                        </div>
                    </>
                ) : (
                    <p>Loading...</p>
                )
            }
        </div>
    );
};

export default Artist;
