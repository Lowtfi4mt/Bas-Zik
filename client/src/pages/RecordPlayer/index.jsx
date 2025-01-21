import './style.css';
import { useState, useRef, useEffect } from 'preact/hooks';
import { usePlaylist } from '../../contexts/PlaylistContext';

const RecordPlayer = ({ audioRef }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [initialMouseAngle, setInitialMouseAngle] = useState(null);
  const [initialAudioTime, setInitialAudioTime] = useState(null);
  const turntableRef = useRef(null);
  const { playlist, currentTrackIndex } = usePlaylist();

  const MAX_TURNS = 30;

  const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;

  const calculateRotationFromAudio = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      return (audio.currentTime / audio.duration) * 360 * MAX_TURNS;
    }
    return 0;
  };

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

  const calculateMouseAngle = (e, rect) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  const handleMouseDown = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = turntableRef.current.getBoundingClientRect();
    setInitialMouseAngle(calculateMouseAngle(e, rect));
    setInitialAudioTime(audio.currentTime);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const audio = audioRef.current;
    if (!audio || !audio.duration) return;

    const rect = turntableRef.current.getBoundingClientRect();
    const currentMouseAngle = calculateMouseAngle(e, rect);
    const angleDelta = currentMouseAngle - initialMouseAngle;

    const normalizedAngleDelta = (angleDelta + 360) % 360;
    const finalAngleDelta =
      normalizedAngleDelta > 180 ? normalizedAngleDelta - 360 : normalizedAngleDelta;

    const timeDeltaMax = finalAngleDelta > 0 ? audio.duration - initialAudioTime - 3 : initialAudioTime;
    const timeDelta = (finalAngleDelta / 180) * timeDeltaMax;
    const newTime = Math.max(0, Math.min(audio.duration - 1, initialAudioTime + timeDelta));
    audio.currentTime = newTime;
    setRotation(calculateRotationFromAudio());
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleVolumeChange = (e) => {
    const volume = e.target.value / 100;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  return (
    <div className="record-player-container" style={{ backgroundColor: theme.background }}>
      <div className="record-player" style={{ backgroundColor: theme.primary }}>
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
          onMouseLeave={isDragging ? handleMouseUp : () => {}}
        >
          <div className="center-label">
            {playlist[currentTrackIndex]?.title || 'Pas de titre...'}
          </div>
        </div>
        <div className="arm" style={{ backgroundColor: theme.secondary }} />
      </div>
      <div className="volume-slider-container">
        <label htmlFor="volume-slider">Volume</label>
        <input
          id="volume-slider"
          className="volume-slider"
          type="range"
          min="0"
          max="100"
          defaultValue="50"
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
};

export default RecordPlayer;
