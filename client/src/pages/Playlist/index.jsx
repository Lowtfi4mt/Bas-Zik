import { useNavigate, useParams } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import { useProfile } from "../../contexts/ProfileContext";
import PlaylistCard from "../../components/PlaylistCard";
import './style.css';

const Playlist = () => {
    const { id } = useParams();
    const { profile } = useProfile();

    const navigate = useNavigate();
    const playlist = profile.playlists[id];

    return (
        <div className="search-results-page">
            <div className="playlist-page-header">
                <button className="return-search-button" onClick={() => navigate(-1)}>Retour</button>
                <h1 className="search-text">Page de playlist</h1>
            </div>

            <PlaylistCard playlist={playlist} index={parseInt(id)} />

            <h2 className="playlist-music-list-header">Titres</h2>
            <div className="search-results"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0px",
                }}
            >
                {playlist.musics.map((music) => (
                    <MusicCard
                        key={music.id}
                        music={music}
                        inPlaylist={parseInt(id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default Playlist;
