import { useState, useEffect } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import durationFormat from "../helpers/durationDisplay";
import { Link } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";

const MusicCard = ({ music, nowPlaying = null }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const { playlist, setPlaylist, currentTrackIndex, setCurrentTrackIndex } = usePlaylist();

    let image = REMOTE_STORAGE_URL + music.path.split("/")[1] + ".jpg";
    let title = music.title;
    let duration = durationFormat(music.duration);
    let likes = music.likes;

    const handlePlayNext = () => {
        setPlaylist((prev) => {prev.splice(currentTrackIndex + 1, 0, music); return [...prev];});
        setMenuOpen(false);
    }

    const handlePlayNow = () => {
        if (nowPlaying != null){
            setCurrentTrackIndex(playlist.findIndex((track) => track.id == music.id));
        }
        else {
            setPlaylist([music]);
            setCurrentTrackIndex(0);
        }
        setMenuOpen(false);
    }

    const handleAddToQueue = () => {
        setPlaylist((prev) => [...prev, music]);
        setMenuOpen(false);
    }

    const handleRemoveFromPlaylist = () => {
        setPlaylist((prev) => {
            const newPlaylist = prev.filter((track) => track.id !== music.id);
            const newCurrentTrackIndex = prev.slice(0, currentTrackIndex).filter((track) => track.id !== music.id).length;
            if (newPlaylist.length === 0) {
                setCurrentTrackIndex(null);
            } else {
                setCurrentTrackIndex(newCurrentTrackIndex >= newPlaylist.length ? newPlaylist.length - 1 : newCurrentTrackIndex);
            }

            return newPlaylist;
        });
        setMenuOpen(false);
    }
    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuOpen && !event.target.closest('.music-card')) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    return (
        <div className={`music-card ${nowPlaying == 0 ? "now-playing" : ""} ${nowPlaying < 0 ? "passed" : ""}`}>
            {/* Image */}
            <img src={image} alt={title} className="music-image" />

            {/* Infos principales */}
            <div className="music-info">
                {nowPlaying == 0 && <span>▶ En cours de lecture...</span>}
                <h3 className="music-title">{title}</h3>
                <p className="music-meta">
                    {music.authors.length > 0 ? (
                        music.authors.map((author, index) => (
                            <span key={author.id}>
                                <Link to={`/app/artist/${author.id}`}>
                                    {author.name}
                                </Link>
                                {index < music.authors.length - 1 && " et "}
                            </span>
                        ))
                    ) : (
                        <span>Artiste inconnu</span>
                    )}
                      &bull; {
                        music.albums.length > 0 ? (
                            music.albums.map((album, index) => (
                                <span key={album.id}>
                                    <Link to={`/app/album/${album.id}`}>
                                        {album.name}
                                    </Link>
                                    {index < music.albums.length - 1 && " et "}
                                </span>
                            ))
                        ) : (
                            <span>Album inconnu</span>
                        )
                      }
                </p>
                <p className="music-stats">
                    <span>{duration}</span> &bull; <span>{likes} likes</span>
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
                        {music.albums.length > 0 && (
                            <Link to={`/app/album/${music.albums[0].id}`}>
                                <li>Accéder à l&apos;album</li>
                            </Link>
                        )}
                        {music.authors.length > 0 && (
                            <Link to={`/app/artist/${music.authors[0].id}`}>
                                <li>Accéder à l&apos;artiste</li>
                            </Link>
                        )}
                        <li>Ajouter un j&apos;aime</li>
                        {playlist.some(track => track.id === music.id) && (
                            <li onClick={handleRemoveFromPlaylist}>
                                Retirer de la liste de lecture
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MusicCard;
