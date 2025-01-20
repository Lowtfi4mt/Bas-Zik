import { createContext } from 'preact';
import { useContext, useState, useEffect } from 'preact/hooks';

const PlaylistContext = createContext(null);

export const PlaylistProvider = ({ children }) => {

  const [playlist, setPlaylist] = useState(() => {
    const playlistData = localStorage.getItem('playlist');
    return playlistData ? JSON.parse(playlistData).playlist : [];
  });
  const [currentTrackIndex, setCurrentTrackIndex] = useState(() => {
    const playlistData = localStorage.getItem('playlist');
    return playlistData ? JSON.parse(playlistData).currentTrackIndex : null;
  });

  useEffect(() => {
      if (playlist) {
        localStorage.setItem('playlist', JSON.stringify({ playlist, currentTrackIndex }));
      } else {
        localStorage.removeItem('playlist');
      }
    }, [playlist, currentTrackIndex]);

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist, currentTrackIndex, setCurrentTrackIndex }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  return useContext(PlaylistContext);
};
