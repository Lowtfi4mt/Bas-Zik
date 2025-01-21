import { useEffect, useState } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import { Link } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";
import { fetchAlbum } from "../helpers/getAlbum";
import { useProfile } from "../contexts/ProfileContext";

const AlbumCard = ({ album }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { setPlaylist, currentTrackIndex, setCurrentTrackIndex } = usePlaylist();
    const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const { profile, setProfile } = useProfile();

    
    const handlePlayNext = () => {
        fetchAlbum(album.id).then(result => setPlaylist((prev) => {prev.splice(currentTrackIndex + 1, 0, ...result.app_musics); return [...prev];}));
        setMenuOpen(false);
    }

    const handlePlayNow = () => {
        fetchAlbum(album.id).then(result => {setPlaylist(result.app_musics); setCurrentTrackIndex(0);});
        setMenuOpen(false);
    }

    const handleAddToQueue = () => {
        fetchAlbum(album.id).then(result => setPlaylist((prev) => [...prev, ...result.app_musics]));
        setMenuOpen(false);
    }

    const handleAddToPlaylist = () => {
        fetchAlbum(album.id).then(result => {
            if (selectedProposal === -1) {
                setProfile((prev) => {
                    const newPlaylist = {
                        title: newPlaylistName.trim(),
                        musics: result.app_musics,
                    };
                    return {
                        ...prev,
                        playlists: [...prev.playlists, newPlaylist],
                    };
                });
            } else {
                setProfile((prev) => {
                    const newPlaylists = prev.playlists.map((playlist, index) => {
                        if (index === selectedProposal) {
                            return {
                                ...playlist,
                                musics: [...playlist.musics, ...result.app_musics],
                            };
                        }
                        return playlist;
                    });
                    return {
                        ...prev,
                        playlists: newPlaylists,
                    };
                });
            }
        });
        setIsPopupOpen(false);
        setMenuOpen(false);
        setNewPlaylistName("");
    };

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

    let image = REMOTE_STORAGE_URL + album?.app_musics?.[0]?.path.split("/")[1] + ".jpg";
    let title = album.name;
    let musics = album.app_musics.length;

    return (
        <div className={'music-card-container'}>
            <div className="music-card" style={{backgroundColor: theme.background}}>
                {/* Image */}
                <img src={image} alt={title} className="music-image" />

                <div className="music-info">
                    <h3 className="music-title">
                        <Link to={`/app/album/${album.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {title}
                        </Link>
                    </h3>
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
                            <li onClick={() => {setIsPopupOpen(true); setMenuOpen(false);}}>Ajouter à une liste de lecture</li>
                            {album.authors.length > 0 && (
                                <Link to={`/app/artist/${album.authors[0].id}`}>
                                    <li>Accéder à l&apos;artiste</li>
                                </Link>
                            )}
                        </ul>
                    </div>
                )}

{isPopupOpen && (
                <div className="popup">
                    <h2>Ajouter à la playlist</h2>
                    <ul className="proposals-list">
                        {profile.playlists.map((playlist, index) => (
                            <li
                                key={index}
                                className={`proposal-item ${
                                    selectedProposal === index
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => setSelectedProposal(index)}
                            >
                                <strong>{playlist.title}</strong> -{" "}
                                {playlist.musics.length} titres
                            </li>
                        ))}
                        <li
                                className={`proposal-item ${
                                    selectedProposal === -1
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => setSelectedProposal(-1)}
                            >
                                <input
                                    type="text"
                                    placeholder="Nouvelle playlist"
                                    value={selectedProposal === -1 ? newPlaylistName : ""}
                                    // @ts-ignore
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                />
                            </li>
                    </ul>
                    <div className="popup-buttons">
                        <button
                            onClick={() => {setIsPopupOpen(false); setMenuOpen(false);}}
                            className="cancel-button"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleAddToPlaylist}
                            className="validate-button"
                            disabled={selectedProposal === null || selectedProposal === -1 && newPlaylistName.trim() === "" }
                        >
                            Valider
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AlbumCard;
