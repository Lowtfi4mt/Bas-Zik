import { useEffect, useState } from "preact/hooks";
import { useParams } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import { Link } from "react-router-dom";
import { fetchAlbum } from "../../helpers/getAlbum";
import { usePlaylist } from "../../contexts/PlaylistContext";

const Album = () => {
    const [results, setResults] = useState(null);
    const { setPlaylist, currentTrackIndex } = usePlaylist();
    const { id } = useParams();

    useEffect(() => {
        fetchAlbum(id).then((result) => setResults(result));
    }, [id]);

    const handlePlayNext = () => {
        fetchAlbum(id).then((result) =>
            setPlaylist((prev) => {
                prev.splice(currentTrackIndex + 1, 0, ...result.musics);
                return prev;
            })
        );
    };

    const handlePlayNow = () => {
        fetchAlbum(id).then((result) => setPlaylist(result.musics));
    };

    const handleAddToQueue = () => {
        fetchAlbum(id).then((result) =>
            setPlaylist((prev) => [...prev, ...result.musics])
        );
    };

    return (
        <div style={{ padding: "20px" }}>
            {results ? (
                <>
                    <div>
                        <h1>Page d&apos;album &bull; {results.title}</h1>
                        <h2>
                            {results.authors.length > 0 ? (
                                results.authors.map((author, index) => (
                                    <span key={index}>
                                        <Link
                                            to={`/artist/${results.authorsId[index]}`}
                                        >
                                            {author}
                                        </Link>
                                        {index < results.authors.length - 1 &&
                                            " et "}
                                    </span>
                                ))
                            ) : (
                                <span>Artiste inconnu</span>
                            )}{" "}
                            &bull; {results.musicCount} titres
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
                            {results.musics.map((music) => (
                                <MusicCard key={music.id} music={music} />
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
