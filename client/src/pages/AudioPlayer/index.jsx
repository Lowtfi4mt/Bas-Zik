import './style.css';
import { useState, useEffect } from 'preact/hooks';

const AudioPlayer = ({ audioRef }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    // Met à jour le temps actuel pendant la lecture
    const updateTime = () => setCurrentTime(audio.currentTime);

    // Définit la durée totale de l'audio une fois chargé
    const setAudioDuration = () => setDuration(audio.duration);

    // Ajouter des écouteurs d'événements
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);

    return () => {
      // Nettoyer les écouteurs d'événements
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
    };
  }, [audioRef]);

  const handlePlayPause = () => {
    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSliderChange = (e) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div>
      <button onClick={handlePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <input
        type="range"
        min="0"
        max={duration}
        step="0.1"
        value={currentTime}
        onChange={handleSliderChange}
      />
      <span>{Math.round(currentTime)} / {Math.round(duration)} sec</span>
    </div>
  );
};

export default AudioPlayer;
