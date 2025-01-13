import { route } from 'preact-router';
import { checkIsProfile } from '../../helpers/profileCheck';
import { useProfile } from '../../helpers/ProfileContext';
import './style.css';
import defaultProfile from '../../utils/defaultProfile.json';
import { Navigate, useNavigate } from 'react-router-dom';


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
        if (!checkIsProfile(profile)) {
          alert('Invalid profile');
          return;
        }
        setAuthProfile(profile);
        navigate('/home');
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
    <div>
      <button onClick={() => { setAuthProfile(defaultProfile); navigate('/home'); }}>Profil invité</button>
      <input type="file" onChange={handleFileUpload} />
    </div>
  );
}
