import './style.css';
import { useState, useRef, useEffect } from 'preact/hooks';
import { Fragment } from 'preact';
import { Header } from '../../components/Header';
import SpecialLayout from '../SpecialLayout';

const MusicManager = () => {
  const audioRef = useRef(null);

  // Liste de lecture
  const playlist = [
    { src: '../../../public/Titanium 8K.ogg' },
    { src: '../../../public/Benny Hill Theme.mp3' },
  ];

  // Piste actuelle
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Mettre à jour la piste actuelle dans l'audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = playlist[currentTrackIndex].src;
      audioRef.current.play(); // Démarre la lecture automatiquement
    }
  }, [currentTrackIndex]);

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

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  return (
    <Fragment>
      <Header />
      <Fragment>
        {/* Balise audio visible */}
        <audio ref={audioRef} style={{ display: 'none' }} />
        <SpecialLayout audioRef={audioRef} handleNext={handleNext} handlePrevious={handlePrevious} handlePlay={handlePlay} />
      </Fragment>
    </Fragment>
  );
};

export default MusicManager;
