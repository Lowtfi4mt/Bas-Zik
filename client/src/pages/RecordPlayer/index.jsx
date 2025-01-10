import './style.css';
import { useState, useRef } from 'preact/hooks';

const RecordPlayer = ({ audioRef }) => {
  const [rotation, setRotation] = useState(0); // Rotation en degrés
  const [isDragging, setIsDragging] = useState(false);
  const turntableRef = useRef(null);

  // Fonction pour normaliser l'angle
  const normalizeAngle = (angle) => {
    return (angle + 360) % 360;
  };

  // Gestion du glissement (drag)
  const handleDrag = (e) => {
    if (!isDragging) return;

    const rect = turntableRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Calcul de l'angle par rapport au centre du disque
    let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    angle = normalizeAngle(angle);
    setRotation(angle);

    // Synchroniser avec la position dans l'audio
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const newTime = (angle / 360) * audio.duration; // Mapper l'angle sur la durée
      audio.currentTime = newTime;
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
      onMouseDown={() => setIsDragging(true)}
      onMouseMove={handleDrag}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)} // Stopper le drag en cas de sortie
    >
        {audioRef.current ? audioRef.current.src.split('/').pop() : 'No music playing'}
    </div>
  );
};

export default RecordPlayer;
