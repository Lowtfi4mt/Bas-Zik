import { useNavigate, useParams } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import { useProfile } from "../../contexts/ProfileContext";
import PlaylistCard from "../../components/PlaylistCard";

const Playlist = () => {
    const { id } = useParams();
    const { profile } = useProfile();

    const navigate = useNavigate();
    const playlist = profile.playlists[id];

    return (
        <div style={{ padding: "20px" }}>
            <button onClick={() => navigate(-1)}>Retour</button>
            <h1>Page de playlist</h1>

            <PlaylistCard playlist={playlist} index={parseInt(id)} />

            <h2>Titres</h2>
            <div
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
