import AudioPlayer from '../AudioPlayer';
import RecordPlayer from '../RecordPlayer';
import './style.css'

export default function AudioPage({ audioRef , handleNext, handlePrevious, handlePlay }) {
    //affiche le record player et le audioplayer l'un en dessous de l'autre
    return (
        <div className="audio-page">
            <RecordPlayer audioRef={audioRef} />
            <AudioPlayer audioRef={audioRef} handleNext={handleNext} handlePrevious={handlePrevious} handlePlay={handlePlay} />
        </div>
    );
}
