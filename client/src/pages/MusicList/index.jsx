import './style.css';
import { usePlaylist } from '../../contexts/PlaylistContext';

export const MusicList = () => {
  const { playlist } = usePlaylist()

  return (
    <div className="music-list">
      <h1>Liste de lecture</h1>
      <ul className="playlist">
        {playlist.map((track, index) => (
          <li key={index} className="track-item">
            <div className="track-info">
              <h3 className="track-title">{track.title || 'Titre à changer'}</h3>
              <p className="track-artist">Artiste : {track.artist || 'Artiste inconnu'}</p>
              <p className="track-duration">Durée : {track.duration || 'Durée inconnue'}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
