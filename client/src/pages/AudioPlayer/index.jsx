import './style.css';
import { useState, useEffect } from 'preact/hooks';

const AudioPlayer = ({ audioRef, handleNext, handlePrevious, handlePlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Récupérer les couleurs du thème depuis le profil
  const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    // Met à jour le temps actuel pendant la lecture
    const updateTime = () => setCurrentTime(audio.currentTime);

    // Définit la durée totale de l'audio une fois chargé
    const setAudioDuration = () => setDuration(audio.duration);

    // Synchronise `isPlaying` avec l'état de lecture réel
    const handlePlayEvent = () => setIsPlaying(true);
    const handlePauseEvent = () => setIsPlaying(false);

    // Ajouter des écouteurs d'événements
    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('play', handlePlayEvent);
    audio.addEventListener('pause', handlePauseEvent);

    return () => {
      // Nettoyer les écouteurs d'événements
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('play', handlePlayEvent);
      audio.removeEventListener('pause', handlePauseEvent);
    };
  }, [audioRef]);

  const handleSliderChange = (e) => {
    const audio = audioRef.current;
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <div className="audio-player" style={{ backgroundColor: theme.background }}>
      {/* Boutons de contrôle */}
      <div className="controls">
        <button
          className="control-button"
          onClick={handlePrevious}
          style={{ backgroundColor: theme.secondary }}
        >
          ⏮ Précédent
        </button>
        <button
          className="control-button play-button"
          onClick={handlePlay}
          style={{
            backgroundColor: theme.primary,
            color: theme.secondary,
          }}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button
          className="control-button"
          onClick={handleNext}
          style={{ backgroundColor: theme.secondary }}
        >
          ⏭ Suivant
        </button>
      </div>

      {/* Barre de progression */}
      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max={duration || 0}
          step="0.1"
          value={currentTime}
          onChange={handleSliderChange}
          style={{
            background: `linear-gradient(to right, ${theme.primary} ${(currentTime / duration) * 100}%, ${theme.secondary} ${(currentTime / duration) * 100}%)`,
          }}
        />
        <div className="time-display" style={{ color: theme.primary }}>
          {Math.round(currentTime)} / {Math.round(duration)} sec
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
