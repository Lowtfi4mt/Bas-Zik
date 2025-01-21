import { useEffect, useState } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import { Link } from "react-router-dom";

const ArtistCard = ({ artist }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;

    let image = REMOTE_STORAGE_URL + artist?.app_musics?.[0].path.split("/")[1] + ".jpg";
    let title = artist.name;
    let musics = artist.app_musics.length;
    let albums = artist.albums.length;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest(".music-card-container")) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className={'music-card-container'}>
            <div className="music-card" style={{backgroundColor: theme.background, color: theme.text}}>
                {/* Image */}
                <img src={image} alt={title} className="music-image" />

                {/* Infos principales */}
                <div className="music-info">
                    <h3 className="music-title">
                        <Link to={`/app/artist/${artist.id}`}>
                            {title}
                        </Link>
                    </h3>
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
