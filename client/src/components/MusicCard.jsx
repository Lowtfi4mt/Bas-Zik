import { useState, useEffect } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import durationFormat from "../helpers/durationDisplay";
import { Link, useNavigate } from "react-router-dom";
import { usePlaylist } from "../contexts/PlaylistContext";
import { useProfile } from "../contexts/ProfileContext";
import { API_URL } from "../constants";

const MusicCard = ({ music, nowPlaying = null, inPlaylist = null }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [newPlaylistName, setNewPlaylistName] = useState("");

    const { profile, setProfile } = useProfile();

    const navigate = useNavigate();

    const { playlist, setPlaylist, currentTrackIndex, setCurrentTrackIndex } =
        usePlaylist();

    let image = music.path ? REMOTE_STORAGE_URL + music.path.split("/")[1] + ".jpg" : "/BasZicLogo.png";
    let title = music.title;
    let duration = durationFormat(music.duration);
    let likes = music.likes;

    const handlePlayNext = () => {
        setPlaylist((prev) => {
            prev.splice(currentTrackIndex + 1, 0, music);
            return [...prev];
        });
        setMenuOpen(false);
    };

    const handlePlayNow = () => {
        if (nowPlaying != null) {
            setCurrentTrackIndex(
                playlist.findIndex((track) => track.id == music.id)
            );
        } else {
            setPlaylist([music]);
            setCurrentTrackIndex(0);
        }
        setMenuOpen(false);

        if (!window.location.pathname.startsWith("/app")) {
            navigate("/app");
        }
    };

    const handleAddToQueue = () => {
        setPlaylist((prev) => [...prev, music]);
        setMenuOpen(false);
    };

    const handleRemoveFromPlaylist = () => {
        setPlaylist((prev) => {
            const newPlaylist = prev.filter((track) => track.id !== music.id);
            const newCurrentTrackIndex = prev
                .slice(0, currentTrackIndex)
                .filter((track) => track.id !== music.id).length;
            if (newPlaylist.length === 0) {
                setCurrentTrackIndex(null);
            } else {
                setCurrentTrackIndex(
                    newCurrentTrackIndex >= newPlaylist.length
                        ? newPlaylist.length - 1
                        : newCurrentTrackIndex
                );
            }

            return newPlaylist;
        });
        setMenuOpen(false);
    };

    const handleAddToPlaylist = () => {
        if (selectedProposal === -1) {
            setProfile((prev) => {
                const newPlaylist = {
                    title: newPlaylistName.trim(),
                    musics: [music],
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
                            musics: [...playlist.musics, music],
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
        setIsPopupOpen(false);
        setMenuOpen(false);
        setNewPlaylistName("");
    };

    const handleRemoveFromPlaylists = () => {
        setProfile((prev) => {
            const newPlaylist = prev.playlists[inPlaylist].musics.filter((track) => track.id !== music.id);
            const updatedPlaylists = prev.playlists.map((playlist, index) => {
                if (index === inPlaylist) {
                    return {
                        ...playlist,
                        musics: newPlaylist,
                    };
                }
                return playlist;
            });
            return { ...prev, playlists: updatedPlaylists };
        });
        setMenuOpen(false);
    };

    const handleLike = () => {
        if (profile.playlists[0].musics.some(like => like.id == music.id)) {
            fetch(API_URL + `musics/app/${music.id}/unlike`, { method: "PUT" }).then((response) => {
                if (response.ok) {
                    setProfile((prev) => {
                        return {
                            ...prev,
                            playlists: [
                                {
                                    ...prev.playlists[0],
                                    musics: prev.playlists[0].musics.filter((like) => like.id !== music.id),
                                },
                                ...prev.playlists.slice(1),
                            ],
                        };
                    });
                }});
        }
        else {
            fetch(API_URL + `musics/app/${music.id}/like`, { method: "PUT" }).then((response) => {
                if (response.ok) {
                    setProfile((prev) => {
                        return {
                            ...prev,
                            playlists: [
                                {
                                    ...prev.playlists[0],
                                    musics: [...prev.playlists[0].musics, music],
                                },
                                ...prev.playlists.slice(1),
                            ],
                        };
                    });
                }
            });
    
        }
        setMenuOpen(false)
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

    return (
        <div className={'music-card-container'}>
            <div className={`music-card ${nowPlaying == 0 ? "now-playing" : ""} ${nowPlaying < 0 ? "passed" : ""}`} 
            style={{backgroundColor: nowPlaying == 0 ? theme.primary : (nowPlaying < 0 ? "white" : theme.background)}}>
                {/* Image */}
                <img src={image} alt={title} className="music-image" />

                {/* Infos principales */}
                <div className="music-info">
                    <h3 className="music-title">{nowPlaying == 0 && <span className="span-lecture">▶ </span>}{title}</h3>
                    <p className="music-meta">
                        {music.authors.length > 0 ? (
                            music.authors.map((author, index) => (
                                <span key={author.id}>
                                    <Link to={`/app/artist/${author.id}`} className="music-author">
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
                    <button className="play-button" onClick={handlePlayNow} style={{backgroundColor: profile.playlists[0].musics.some( like => like.id == music.id) ? "#ff0000" : theme.secondary}}>▶</button>
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
                        <li onClick={handleAddToQueue}>
                            Ajouter à la file d&apos;attente
                        </li>
                        <li onClick={() => {setIsPopupOpen(true); setMenuOpen(false);}}>Ajouter à une liste de lecture</li>
                        <li>
                        {music.albums.length > 0 && (
                            <Link to={`/app/album/${music.albums[0].id}`} class="context-menu-text">
                                Accéder à l&apos;album
                            </Link>
                        )}
                        </li>
                        <li>
                        {music.authors.length > 0 && (
                            <Link to={`/app/artist/${music.authors[0].id}`} class="context-menu-text">
                                Accéder à l&apos;artiste
                            </Link>
                        )}
                        </li>
                        <li onClick={handleLike}>{profile.playlists[0].musics.some(like => like.id == music.id) ? "Je n'aime plus" : "J'aime"}</li>
                        {inPlaylist == null && playlist.some(track => track.id === music.id) && (
                            <li onClick={handleRemoveFromPlaylist}>
                                Retirer de la liste de lecture
                            </li>
                        )}
                        {inPlaylist !== null && (
                            <li onClick={handleRemoveFromPlaylists}>
                                Retirer de la liste de lecture
                            </li>
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

export default MusicCard;
