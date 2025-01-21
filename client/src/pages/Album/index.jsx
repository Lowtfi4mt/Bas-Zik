import { useEffect, useState } from "preact/hooks";
import { useNavigate, useParams } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import { fetchAlbum } from "../../helpers/getAlbum";
import AlbumCard from "../../components/AlbumCard";
import './style.css';

const Album = () => {
    const [results, setResults] = useState(null);
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        fetchAlbum(id).then((result) => setResults(result));
    }, [id]);

    return (
        <div style={{ padding: "20px" }}>
            <button className="return-search-button" onClick={() => navigate(-1)}>Retour</button>
            <h1 className="search-text">Page d&apos;album &bull;</h1>
            {results ? (
                <>
                    <div className="search-results">
                        <AlbumCard album={results} />

                        <h2>Titres</h2>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0px",
                            }}
                        >
                            {results.app_musics.map((music) => (
                                <MusicCard key={music.id} music={{...music, albums: [{
                                    id: results.id,
                                    name: results.name
                                }], authors: results.authors}} />
                            ))}
                        </div>
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Album;
