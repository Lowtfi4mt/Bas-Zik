import { useState } from "preact/hooks";
import "./MusicCard.css";
import { REMOTE_STORAGE_URL } from "../constants";
import durationFormat from "../helpers/durationDisplay";

const MusicCard = ({ music }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    let image = REMOTE_STORAGE_URL + music.path.split("/")[1] + ".jpg";
    let title = music.title;
    let artist = music.authors.join(", ");
    let album = music.albums.join(", ");
    let duration = durationFormat(music.duration);
    let likes = music.likes;

    return (
        <div className="music-card">
            {/* Image */}
            <img src={image} alt={title} className="music-image" />

            {/* Infos principales */}
            <div className="music-info">
                <h3 className="music-title">{title}</h3>
                <p className="music-meta">
                    <span>{artist}</span> &bull; <span>{album}</span>
                </p>
                <p className="music-stats">
                    <span>{duration}</span> &bull; <span>{likes} likes</span>
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
                        <li>Accéder à l&apos;album</li>
                        <li>Accéder à l&apos;artiste</li>
                        <li>Ajouter un j&apos;aime</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MusicCard;
