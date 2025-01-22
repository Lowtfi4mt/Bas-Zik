import { checkIsProfile } from '../../helpers/profileCheck';
import { useProfile } from '../../contexts/ProfileContext';
import './style.css';
import defaultProfile from '../../utils/defaultProfile.json';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'preact/hooks';

export function Welcome() {
  const { login: setAuthProfile } = useProfile();
  const navigate = useNavigate();
  const [isRotating, setIsRotating] = useState(false); // État pour gérer l'animation

  const { profile, setProfile } = useProfile();

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    if (profile && checkIsProfile(profile)) {
      navigate('/home');
    }
  }, []);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (!uploadedFile || uploadedFile.type !== 'application/json') {
      alert('Invalid file type. Please upload a JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const profile = JSON.parse(e.target.result.toString());
        if (!checkIsProfile(profile)) {
          alert('Invalid profile');
          return;
        }
        else {
          setProfile(profile);
          navigate('/home');
        }
      } catch (error) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleImageClick = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 2000); // Réinitialise après la durée de l'animation
  };

  return (
    <div className="outer-container">
    <div className="centered-container">
      <div className="text-section">
        <h1 className="title">Bas'Zik</h1>
        <p className="subtitle">Avec Bas'Zik, c'est simple : vous n'avez pas les basses !</p>
        <p>Bienvenue sur notre site d'écoute de musique Bas'Zik : Nous vous invitons à vous connecter en chargeant votre profil utilisateur si vous en possédez un ou à utiliser le profil invité.</p>
      </div>
      <img src= '../../BasZicLogo.png' className={`logo ${isRotating ? 'rotate' : ''}`} width='130px' height="" onClick={handleImageClick}  />

      <div className="button-section">
        <button className="button button-primary" onClick={() => { setAuthProfile(defaultProfile); navigate('/home'); }}>
          Utiliser le profil invité
        </button>
        <label className="file-upload">
          <input type="file" onChange={handleFileUpload} />
          Charger un profil utilisateur
        </label>
      </div>
    </div>
  </div>
);
}
