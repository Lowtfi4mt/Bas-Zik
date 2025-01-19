import { useState } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import durationFormat from "../helpers/durationDisplay";
import { Link } from "react-router-dom";

const MusicCard = ({ music }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    let image = REMOTE_STORAGE_URL + music.path.split("/")[1] + ".jpg";
    let title = music.title;
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
                    {music.authors.length > 0 ? (
                        music.authors.map((author, index) => (
                            <span key={index}>
                                <Link to={`/artist/${music.authorsId[index]}`}>
                                    {author}
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
                                <span key={index}>
                                    <Link to={`/album/${music.albumsId[index]}`}>
                                        {album}
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
                        {music.albumsId.length > 0 && (
                            <Link to={`/album/${music.albumsId[0]}`}>
                                <li>Accéder à l&apos;album</li>
                            </Link>
                        )}
                        {music.authorsId.length > 0 && (
                            <Link to={`/artist/${music.authorsId[0]}`}>
                                <li>Accéder à l&apos;artiste</li>
                            </Link>
                        )}
                        <li>Ajouter un j&apos;aime</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MusicCard;
