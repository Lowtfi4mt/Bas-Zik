import './style.css';
import { useState, useRef, useEffect } from 'preact/hooks';

const RecordPlayer = ({ audioRef }) => {

  // Calcul de la rotation en fonction du temps audio
  const calculateRotation = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      // Rotation totale sur plusieurs tours
      return (audio.currentTime / audio.duration) * 360 * MAX_TURNS;
    }
    return 0;
  };

  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(calculateRotation);
  const [initialMouseAngle, setInitialMouseAngle] = useState(null); // Angle initial au moment du clic
  const [initialAudioTime, setInitialAudioTime] = useState(null); // Temps audio initial au clic
  const turntableRef = useRef(null);

  const MAX_TURNS = 30; // Nombre de tours complets pour toute la durée de l'audio

   // Calcul de la rotation en fonction de l'audio
   const calculateRotationFromAudio = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      return (audio.currentTime / audio.duration) * 360 * MAX_TURNS; // 30 tours
    }
    return 0;
  };

  // Effet pour synchroniser la rotation avec l'audio
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateRotation = () => {
      setRotation(calculateRotation());
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
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Angle en degrés
  };

  // Gestion du clic souris
  const handleMouseDown = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    // Pause la musique et mémorise l'angle initial
    audio.pause();
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
    const timeDelta = (finalAngleDelta / 180 ) * timeDeltaMax;
    const newTime = Math.max(0, Math.min(audio.duration - 1 , initialAudioTime + timeDelta));
    if (Math.abs(audio.currentTime - newTime) > 20) {
      handleMouseUp();
    }
    else {
      audio.currentTime = newTime; // Mise à jour du temps audio
      setRotation(calculateRotationFromAudio()); // Met à jour la rotation visuelle
    }
  };

  // Gestion du relâchement souris
  const handleMouseUp = () => {
    setIsDragging(false);
    const audio = audioRef.current;
    if (audio) {
      audio.play(); // Reprend la lecture
    }
  };

  return (
    <div
      ref={turntableRef}
      className="disk"
      style={{
        transform: `rotate(${rotation}deg)`,
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, #444 50%, #222 100%)',
        cursor: 'grab',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={isDragging ? handleMouseUp : () => {}} // Arrête le drag en cas de sortie de la souris
    >
      {audioRef.current ? audioRef.current.src.split('/').pop() : 'No music playing'}
    </div>
  );
};

export default RecordPlayer;