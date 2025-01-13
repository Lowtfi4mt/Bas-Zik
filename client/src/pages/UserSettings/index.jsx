import { useState } from 'preact/hooks';
import './style.css';
import { saveProfile } from '../../helpers/profileSave';
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('profile'));
    const colors = [
        {
          name : 'classique',
          primary: '#3498db',
          secondary: '#2ecc71',
          background: '#e74c3c',
        },
        {
          name : 'sombre',
          primary: '#2c3e50',
          secondary: '#34495e',
          background: '#7f8c8d',
        },
        {
          name : 'clair',
          primary: '#ecf0f1',
          secondary: '#bdc3c7',
          background: '#95a5a6',
        },
    ];
    const [username, setUserName] = useState(user.username);
    const [theme, setTheme] = useState(user.layout.theme);
    const [isModified, setIsModified] = useState(false);

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
        setIsModified(true);
    };

    const handleThemeChange = (e) => {
        const selectedTheme = colors.find((color) => color.name === e.target.value);
        setTheme(selectedTheme);
        setIsModified(true);
    };

    const handleSave = () => {
        if (isModified) {
            user.username = username;
            user.layout.theme = theme;
            const isSaved = saveProfile(user);
            if (isSaved) {
                setIsModified(false);
                navigate('/home');
            } else {
                alert('Erreur lors de la sauvegarde du profil');
            }
        }
    };

    const handleCancel = () => {
        if (isModified) {
            const confirmCancel = window.confirm(
                'Vous avez des modifications non sauvegardées. Voulez-vous vraiment annuler ?'
            );
            if (!confirmCancel) return;
        }
        navigate('/home');
    };

    const handleExport = () => {
        const profile = localStorage.getItem('profile');
        if (!profile) {
            alert('Aucun profil trouvé dans le localStorage.');
            return;
        }

        const blob = new Blob([profile], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'profile.json'; // Nom du fichier téléchargé
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="user-editor">
            {/* Titre */}
            <h1 className="user-editor-title">Utilisateur</h1>

            {/* Formulaire */}
            <form className="user-editor-form">
                <div className="form-group">
                    <label htmlFor="username">Nom :</label>
                    <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={handleUserNameChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="theme">Thème de couleur :</label>
                    <select id="theme" value={theme.name} onChange={handleThemeChange}>
                        {colors.map((color) => (
                            <option key={color.name} value={color.name}>
                                {color.name}
                            </option>
                        ))}
                    </select>
                    <div className="color-preview">
                        <div
                            className="color-box"
                            style={{ backgroundColor: theme.primary }}
                        />
                        <div
                            className="color-box"
                            style={{ backgroundColor: theme.secondary }}
                        />
                        <div
                            className="color-box"
                            style={{ backgroundColor: theme.background }}
                        />
                    </div>
                </div>
            </form>

            {/* Boutons */}
            <div className="user-editor-buttons">
                <button type="button" onClick={handleCancel}>
                    Retour
                </button>
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={!isModified}
                    className={isModified ? 'active' : 'disabled'}
                >
                    Sauvegarder
                </button>
                <button type="button" onClick={handleExport}>
                    Exporter JSON
                </button>
            </div>
        </div>
    );
};

export default UserSettings;
