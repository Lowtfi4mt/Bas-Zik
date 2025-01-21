import { useEffect, useState } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import { Link, useNavigate } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";
import { useProfile } from "../contexts/ProfileContext";

const PlaylistCard = ({ playlist, index }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { setPlaylist, currentTrackIndex, setCurrentTrackIndex } = usePlaylist();
    const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;
    const { setProfile } = useProfile();

    const navigate = useNavigate();
    
    const handlePlayNext = () => {
        setPlaylist((prev) => {prev.splice(currentTrackIndex + 1, 0, ...playlist.musics); return prev;});
        setMenuOpen(false);
    }

    const handlePlayNow = () => {
        setPlaylist(playlist.musics); 
        setCurrentTrackIndex(0);
        setMenuOpen(false);
        navigate('/app/');
    }

    const handleAddToQueue = () => {
        setPlaylist((prev) => [...prev, ...playlist.musics]);
        setMenuOpen(false);
    }

    const handleDeletePlaylist = () => {
        setProfile((prev) => {
            const newPlaylists = prev.playlists.filter((_, i) => i !== index);
            return {
                ...prev,
                playlists: newPlaylists,
            };
        });
        setMenuOpen(false);
        navigate('/home/');
    }


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

    let image = REMOTE_STORAGE_URL + playlist?.musics?.[0]?.path.split("/")[1] + ".jpg";
    let title = playlist.title;
    let musics = playlist.musics.length;

    return (
        <div className={'music-card-container'}>
            <div className="music-card" style={{backgroundColor: theme.background}}>
                {/* Image */}
                <img src={image} alt={title} className="music-image" />

                <div className="music-info">
                    <h3 className="music-title">
                        <Link to={`/app/playlist/${index}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {title}
                        </Link>
                    </h3>
                    <p className="music-stats">
                        <span>{musics} titres</span>
                    </p>
                </div>

                {/* Boutons d'action */}
                <div className="music-actions">
                    <button className="play-button" onClick={handlePlayNow} style={{backgroundColor: theme.secondary}}>▶</button>
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
                            <li onClick={handlePlayNow}>Lire maintenant</li>
                            <li onClick={handlePlayNext}>Lire ensuite</li>
                            <li onClick={handleAddToQueue}>Ajouter à la file d&apos;attente</li>
                            <li onClick={handleDeletePlaylist}>Supprimer la liste</li>
                        </ul>
                    </div>
                )}

        </div>
    );
};

export default PlaylistCard;
