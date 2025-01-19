import './style.css';
import { useState, useRef, useEffect } from 'preact/hooks';
import { usePlaylist } from '../../contexts/PlaylistContext';

const RecordPlayer = ({ audioRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0); // Rotation basée sur l'audio
  const [initialMouseAngle, setInitialMouseAngle] = useState(null); // Angle initial
  const [initialAudioTime, setInitialAudioTime] = useState(null); // Temps audio initial
  const turntableRef = useRef(null);

  const { playlist, currentTrackIndex } = usePlaylist();

  const MAX_TURNS = 30; // 30 tours pour couvrir toute la durée de l'audio

  // Récupérer le thème depuis localStorage
  const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;

  // Calcul de la rotation basée sur l'audio
  const calculateRotationFromAudio = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      return (audio.currentTime / audio.duration) * 360 * MAX_TURNS;
    }
    return 0;
  };

  // Synchronisation de la rotation avec l'audio
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateRotation = () => {
      setRotation(calculateRotationFromAudio());
    };

    audio.addEventListener('timeupdate', updateRotation);

    return () => {
      audio.removeEventListener('timeupdate', updateRotation);
    };
  }, [audioRef]);

  // Calcul de l'angle entre la souris et le centre du disque
  const calculateMouseAngle = (e, rect) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  // Gestion du clic souris
  const handleMouseDown = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Pause la musique et mémorise l'angle initial
    const rect = turntableRef.current.getBoundingClientRect();
    setInitialMouseAngle(calculateMouseAngle(e, rect));
    setInitialAudioTime(audio.currentTime);
    setIsDragging(true);
  };

  // Gestion du déplacement souris
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = turntableRef.current.getBoundingClientRect();
    const currentMouseAngle = calculateMouseAngle(e, rect);
    const angleDelta = currentMouseAngle - initialMouseAngle;

    // Normalisation de l'angle entre -180° et 180°
    const normalizedAngleDelta = (angleDelta + 360) % 360;
    const finalAngleDelta =
      normalizedAngleDelta > 180 ? normalizedAngleDelta - 360 : normalizedAngleDelta;

    // Conversion de l'angle en temps audio
    const timeDeltaMax = finalAngleDelta > 0 ? audio.duration - initialAudioTime - 3 : initialAudioTime;
    const timeDelta = (finalAngleDelta / 180) * timeDeltaMax;
    const newTime = Math.max(0, Math.min(audio.duration - 1, initialAudioTime + timeDelta));
    if (Math.abs(audio.currentTime - newTime) > 20) {
      handleMouseUp();
    } else {
      audio.currentTime = newTime; // Mise à jour du temps audio
      setRotation(calculateRotationFromAudio()); // Met à jour la rotation visuelle
    }
  };

  // Gestion du relâchement souris
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="record-player-container"
      style={{ backgroundColor: theme.background }}
    >
      <div className="record-player"
        style={{ backgroundColor: theme.primary }}>
        <div
          ref={turntableRef}
          className="disk"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: `linear-gradient(to right, white, black 80%)`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={isDragging ? handleMouseUp : () => {}} // Arrête le drag en cas de sortie de la souris
        >
          <div className="center-label" style={{ backgroundColor: 'grey' }}>
            {audioRef.current ? (playlist[currentTrackIndex].title) : 'Pas de titre...'}
          </div>
        </div>
        <div
          className="arm"
          style={{ backgroundColor: theme.secondary }}
        />
      </div>
    </div>
  );
};

export default RecordPlayer;
