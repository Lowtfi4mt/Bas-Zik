import './style.css';
import { usePlaylist } from '../../contexts/PlaylistContext';
import MusicCard from '../../components/MusicCard';
import { useRef, useState, useEffect } from 'preact/hooks';

export const MusicList = () => {
  const { playlist, currentTrackIndex, setPlaylist, setCurrentTrackIndex } = usePlaylist();
  const [items, setItems] = useState(playlist);
  const dragItem = useRef();
  const dragOverItem = useRef();

  useEffect(() => {
    setItems(playlist);
  }, [playlist]);

  useEffect(() => {
    // Trigger re-render when currentTrackIndex changes
  }, [currentTrackIndex]);

  const handleSort = () => {
    let _items = [...items];
    const draggedItemContent = _items.splice(dragItem.current, 1)[0];
    _items.splice(dragOverItem.current, 0, draggedItemContent);

    setItems(_items);
    setPlaylist(_items);

    if (dragItem.current === currentTrackIndex) {
      setCurrentTrackIndex(dragOverItem.current);
    // @ts-ignore
    } else if (dragItem?.current < currentTrackIndex && dragOverItem?.current >= currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    // @ts-ignore
    } else if (dragItem?.current > currentTrackIndex && dragOverItem?.current <= currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  };

  return (
    <div className="music-list">
      <h1>Liste de lecture</h1>
      <ul className="playlist">
        {items.map((track, index) => (
          <li
            key={index}
            draggable
            onDragStart={() => (dragItem.current = index)}
            onDragEnter={() => (dragOverItem.current = index)}
            onDragEnd={handleSort}
            onDragOver={(e) => e.preventDefault()}
          >
            <MusicCard music={track} nowPlaying={index - currentTrackIndex} />
          </li>
        ))}
      </ul>
    </div>
  );
};