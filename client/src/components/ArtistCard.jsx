import { useState } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import { Link } from "react-router-dom";

const ArtistCard = ({ artist }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    let image = REMOTE_STORAGE_URL + artist.path.split("/")[1] + ".jpg";
    let title = artist.name;
    let musics = artist.musicCount;
    let albums = artist.albumCount;

    return (
        <div className="music-card">
            {/* Image */}
            <img src={image} alt={title} className="music-image" />

            {/* Infos principales */}
            <div className="music-info">
                <Link to={`/artist/${artist.id}`}><h3 className="music-title">{title}</h3></Link>
                <p className="music-stats">
                    <span>{albums} albums  &bull;  {musics} titres</span>
                </p>
            </div>

            {/* Boutons d'action */}
            <div className="music-actions">
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
                        <li>Lecture aléatoire</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ArtistCard;
