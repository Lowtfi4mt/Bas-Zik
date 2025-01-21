import { useState } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import { Link } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";
import { fetchAlbum } from "../helpers/getAlbum";

const AlbumCard = ({ album }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { setPlaylist, currentTrackIndex } = usePlaylist();
    
    const handlePlayNext = () => {
        fetchAlbum(album.id).then(result => setPlaylist((prev) => {prev.splice(currentTrackIndex + 1, 0, ...result.musics); return prev;}));
        setMenuOpen(false);
    }

    const handlePlayNow = () => {
        fetchAlbum(album.id).then(result => setPlaylist(result.musics));
        setMenuOpen(false);
    }

    const handleAddToQueue = () => {
        fetchAlbum(album.id).then(result => setPlaylist((prev) => [...prev, ...result.musics]));
        setMenuOpen(false);
    }


    let image = REMOTE_STORAGE_URL + album?.app_musics?.[0]?.path.split("/")[1] + ".jpg";
    let title = album.name;
    let musics = album.app_musics.length;

    return (
        <div className="music-card">
            {/* Image */}
            <img src={image} alt={title} className="music-image" />

            <div className="music-info">
                <Link to={`/app/album/${album.id}`}>
                    <h3 className="music-title">{title}</h3>
                </Link>
                <p className="music-meta">
                    {album.authors.length > 0 ? (
                        album.authors.map((author, index) => (
                            <span key={author.id}>
                                <Link to={`/app/artist/${author.id}`}>
                                    {author.name}
                                </Link>
                                {index < album.authors.length - 1 && " et "}
                            </span>
                        ))
                    ) : (
                        <span>Artiste inconnu</span>
                    )}
                </p>
                <p className="music-stats">
                    <span>{musics} titres</span>
                </p>
            </div>

            {/* Boutons d'action */}
            <div className="music-actions">
                <button className="play-button" onClick={handlePlayNow}>▶</button>
                <button
                    className="more-options-button"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ⋮
                </button>
            </div>

            {/* Menu contextuel */}
            {menuOpen && (
                <div className="context-menu">
                    <ul>
                        <li onClick={handlePlayNow}>Lire maintenant</li>
                        <li onClick={handlePlayNext}>Lire ensuite</li>
                        <li onClick={handleAddToQueue}>Ajouter à la file d&apos;attente</li>
                        <li>Ajouter à une liste de lecture</li>
                        {album.authors.length > 0 && (
                            <Link to={`/app/artist/${album.authors[0].id}`}>
                                <li>Accéder à l&apos;artiste</li>
                            </Link>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AlbumCard;
