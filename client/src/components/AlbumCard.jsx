import { useState } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import { Link } from "react-router-dom";

const MusicCard = ({ album }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    let image = REMOTE_STORAGE_URL + album.path.split("/")[1] + ".jpg";
    let title = album.title;
    let musics = album.musicCount;

    return (
        <div className="music-card">
            {/* Image */}
            <img src={image} alt={title} className="music-image" />

            <div className="music-info">
                <Link to={`/album/${album.id}`}>
                    <h3 className="music-title">{title}</h3>
                </Link>
                <p className="music-meta">
                    {album.authors.length > 0 ? (
                        album.authors.map((author, index) => (
                            <span key={index}>
                                <Link to={`/artist/${album.authorsId[index]}`}>
                                    {author}
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
                <button className="play-button">▶</button>
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
                        <li>Lire maintenant</li>
                        <li>Lire ensuite</li>
                        <li>Ajouter à la file d&apos;attente</li>
                        <li>Ajouter à une liste de lecture</li>
                        {album.authorsId.length > 0 && (
                            <Link to={`/artist/${album.authorsId[0]}`}>
                                <li>Accéder à l&apos;artiste</li>
                            </Link>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MusicCard;
