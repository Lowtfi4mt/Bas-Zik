import { createContext } from 'preact';
import { useContext, useState } from 'preact/hooks';

const PlaylistContext = createContext(null);

export const PlaylistProvider = ({ children }) => {

  const initSongs = [
    "LRPGqNeav_M",
    "RkKyB284eHQ",
    "Trcr4YBELCA",
    "wl_QRuCPzbE",
    "zNfyJxXcfp8",
    "9VQ2J3PA7uo",
  ]

  const [playlist, setPlaylist] = useState(initSongs.map(path => ({ path })));
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  return (
    <PlaylistContext.Provider value={{ playlist, setPlaylist, currentTrackIndex, setCurrentTrackIndex }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  return useContext(PlaylistContext);
};
