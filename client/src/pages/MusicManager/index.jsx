import './style.css';
import { useRef, useEffect } from 'preact/hooks';
import { Fragment } from 'preact';
import SpecialLayout from '../SpecialLayout';
import { REMOTE_STORAGE_URL } from '../../constants';
import { usePlaylist } from '../../contexts/PlaylistContext';

const MusicManager = () => {
  const audioRef = useRef(null);

  const { playlist, currentTrackIndex, setCurrentTrackIndex } = usePlaylist()

  // Mettre à jour la piste actuelle dans l'audio
  useEffect(() => {
    if (audioRef.current && currentTrackIndex !== null) {
      audioRef.current.src = REMOTE_STORAGE_URL + playlist[currentTrackIndex].path.split("/")[1] + ".ogg";
      audioRef.current.play(); // Démarre la lecture automatiquement
    }
  }, [playlist[currentTrackIndex]?.id]);

  // Gestion de la fin de la piste
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTrackEnd = () => {
      if (currentTrackIndex < playlist.length - 1) {
        setCurrentTrackIndex((prevIndex) => prevIndex + 1);
      } else {
        setCurrentTrackIndex(0); // Boucler la liste
      }
    };

    audio.addEventListener('ended', handleTrackEnd);

    return () => {
      audio.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrackIndex, playlist]);

  // Gestion des boutons "précédent" et "suivant"
  const handlePrevious = () => {
    console.log('Previous');
    setCurrentTrackIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : playlist.length - 1
    );
  };

  const handleNext = () => {
    console.log('Next');
    setCurrentTrackIndex((prevIndex) =>
      prevIndex < playlist.length - 1 ? prevIndex + 1 : 0
    );
  };

  const handlePlay = () => {
    console.log('Play');
    const audio = audioRef.current;
    if (!audio) return;

    if (currentTrackIndex === null && playlist.length > 0) {
      setCurrentTrackIndex(0);
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  return (
    <Fragment>
      {/* Balise audio visible */}
			<audio ref={audioRef} style={{ display: 'none' }} />
      <SpecialLayout audioRef={audioRef} handleNext={handleNext} handlePrevious={handlePrevious} handlePlay={handlePlay} />
    </Fragment>
  );
};

export default MusicManager;
