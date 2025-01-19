import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const PlaylistContext = createContext(null);

export const PlaylistProvider = ({ children }) => {

  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist, currentTrackIndex, setCurrentTrackIndex }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  return useContext(PlaylistContext);
};
