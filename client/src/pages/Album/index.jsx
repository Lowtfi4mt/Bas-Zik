import { useEffect, useState } from "preact/hooks";
import { useNavigate, useParams } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import { Link } from "react-router-dom";
import { fetchAlbum } from "../../helpers/getAlbum";
import { usePlaylist } from "../../contexts/PlaylistContext";

const Album = () => {
    const [results, setResults] = useState(null);
    const { setPlaylist, currentTrackIndex } = usePlaylist();
    const { id } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        fetchAlbum(id).then((result) => setResults(result));
    }, [id]);

    const musicsWithMetadata = (musics) => musics.map(music => ({...music, albums: [{
        id: results.id,
        name: results.name
    }], authors: results.authors}))

    const handlePlayNext = () => {
        fetchAlbum(id).then((result) =>
            setPlaylist((prev) => {
                prev.splice(currentTrackIndex + 1, 0, ...musicsWithMetadata(result.app_musics));
                return [...prev];
            })
        );
    };

    const handlePlayNow = () => {
        fetchAlbum(id).then((result) => setPlaylist(musicsWithMetadata(result.app_musics)));
    };

    const handleAddToQueue = () => {
        fetchAlbum(id).then((result) =>
            setPlaylist((prev) => [...prev, ...musicsWithMetadata(result.app_musics)])
        );
    };

    return (
        <div style={{ padding: "20px" }}>
            {results ? (
                <>
                    <div>
                        <button onClick={() => navigate(-1)}>Retour</button>
                        <h1>Page d&apos;album &bull; {results.name}</h1>
                        <h2>
                            {results.authors.length > 0 ? (
                                results.authors.map((author, index) => (
                                    <span key={index}>
                                        <Link
                                            to={`/artist/${author.id}`}
                                        >
                                            {author.name}
                                        </Link>
                                        {index < results.authors.length - 1 &&
                                            " et "}
                                    </span>
                                ))
                            ) : (
                                <span>Artiste inconnu</span>
                            )}{" "}
                            &bull; {results.app_musics.length} titres
                        </h2>
                        <div>
                            <ul>
                                <li onClick={handlePlayNow}>Lire maintenant</li>
                                <li onClick={handlePlayNext}>Lire ensuite</li>
                                <li onClick={handleAddToQueue}>
                                    Ajouter à la file d&apos;attente
                                </li>
                                <li>Ajouter à une liste de lecture</li>
                            </ul>
                        </div>

                        <h2>Titres</h2>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "20px",
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
