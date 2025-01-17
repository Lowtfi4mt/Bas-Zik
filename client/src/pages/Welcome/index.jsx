import { checkIsProfile } from '../../helpers/profileCheck';
import { useProfile } from '../../contexts/ProfileContext';
import './style.css';
import defaultProfile from '../../utils/defaultProfile.json';
import { Navigate, useNavigate } from 'react-router-dom';
import { saveProfile } from '../../helpers/profileSave';


export function Welcome() {
  const { login: setAuthProfile } = useProfile();
  const navigate = useNavigate();


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
        const isProfile = saveProfile(profile);
        if (!isProfile) {
          alert('Invalid profile');
          return;
        }
        else {
          navigate('/home');
        }
      } catch (error) {
        alert('Error parsing JSON file.');
      }
    };
    reader.readAsText(uploadedFile);
  };

  const handleGuestProfile = async () => {
    try {
      const response = await fetch('/utils/defaultProfile.json'); // Charge le fichier JSON par défaut
      const profile = await response.json();
      if (!checkIsProfile(profile)) {
        alert('Invalid default profile');
        return;
      }
      setAuthProfile(profile);
    } catch (error) {
      alert('Error loading default profile');
    }
  };

  return (
    <div className="outer-container">
    <div className="centered-container">
      <div className="text-section">
        <h1 className="title">Bas'Zik</h1>
        <p className="subtitle">Avec Bas'Zik, c'est simple : vous n'avez pas les basses !</p>
        <p>Bienvenue sur notre site d'écoute de musique Bas'Zik : Nous vous invitons à vous connecter en chargeant votre profil utilisateur si vous en possédez un ou à utiliser le profil invité.</p>
      </div>

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
