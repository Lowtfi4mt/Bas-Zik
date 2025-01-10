import './style.css';
import { Fragment } from 'preact';
import { useRef } from 'preact/hooks';
import AudioPlayer from '../AudioPlayer';
import RecordPlayer from '../RecordPlayer';

const MusicManager = () => {
  const audioRef = useRef(null);

  return (
    <Fragment>
      {/* Fournir la référence de l'élément audio */}
      <audio ref={audioRef} src="../../../public/Titanium 8K.ogg" />
      <AudioPlayer audioRef={audioRef} />
      <RecordPlayer audioRef={audioRef} />
    </Fragment>
  );
};

export default MusicManager;
