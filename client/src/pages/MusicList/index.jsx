import './style.css';
import { usePlaylist } from '../../contexts/PlaylistContext';
import MusicCard from '../../components/MusicCard';

export const MusicList = () => {
  const { playlist, currentTrackIndex } = usePlaylist()

  return (
    <div className="music-list">
      <h1>Liste de lecture</h1>
      <ul className="playlist">
        {playlist.map((track, index) => (
          <MusicCard key={index} music={track} nowPlaying={index - currentTrackIndex} />
        ))}
      </ul>
    </div>
  );
};
