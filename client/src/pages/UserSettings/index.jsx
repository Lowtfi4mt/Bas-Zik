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
        {
            name : 'Daltoniens - Protanopie',
            primary: '#704d1c',
            secondary: '#FFE900',
            background: '#0064B1',
        }
        ,
        {
            name : 'Daltoniens - Deuteranopie',
            primary: '#99660c',
            secondary: '#FFB23C',
            background: '#0064B1',
        },
        {
            name : 'Daltoniens - Tritanopie',
            primary: '#7A474C',
            secondary: '#FFDAE0',
            background: '#3CB3C6',
        }
    ];
    const [username, setUserName] = useState(user.username);
    const [theme, setTheme] = useState(user.layout.theme);
    const [isModified, setIsModified] = useState(false);
    const [layout, setLayout] = useState({
        leftPanel: user.layout.leftPanel,
        centerPanel: user.layout.centerPanel,
        rightPanel: user.layout.rightPanel,
    });

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
            user.layout.leftPanel = layout.leftPanel;
            user.layout.centerPanel = layout.centerPanel;
            user.layout.rightPanel = layout.rightPanel;
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
        if (isModified) {
            const confirmCancel = window.confirm(
                'Vous avez des modifications non sauvegardées. Voulez-vous vraiment exporter votre profil ?'
            );
            if (!confirmCancel) return;
        }
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

    const handleDragStart = (e, column) => {
        e.dataTransfer.setData('column', column);
    };

    const handleDrop = (e, targetColumn) => {
        e.preventDefault();
        const sourceColumn = e.dataTransfer.getData('column');
        if (!sourceColumn || sourceColumn === targetColumn) return;

        setLayout((prevLayout) => {
            const updatedLayout = { ...prevLayout };
            [updatedLayout[sourceColumn], updatedLayout[targetColumn]] = [
                updatedLayout[targetColumn],
                updatedLayout[sourceColumn],
            ];
            return updatedLayout;
        });
        setIsModified(true);
    };

    const allowDrop = (e) => e.preventDefault();

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

            <div className="layout-editor">
                <h2>Modifier la mise en page</h2>
                <div className="layout-manager-container">
                    {['leftPanel', 'centerPanel', 'rightPanel'].map((column) => (
                        <div
                            key={column}
                            className={`layout-manager-column ${column}`}
                            onDrop={(e) => handleDrop(e, column)}
                            onDragOver={allowDrop}
                        >
                            <h3>{column === 'leftPanel' ? 'Gauche' : (column === 'centerPanel' ? 'Centre' : 'Droite')}</h3>
                            {layout[column] && (
                                <div
                                    className="layout-manager-item"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, column)}
                                >
                                    {layout[column] === 'NavigationPage' ? 'Page de navigation' : (layout[column] === 'AudioPage' ? 'Tourne disque' : 'Liste de lecture')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Boutons */}
            <div className="user-editor-buttons">
                <button type="button" class="cancel-button" onClick={handleCancel}>
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
                <button type="button" class="validate-button" onClick={handleExport}>
                    Exporter JSON
                </button>
            </div>
        </div>
    );
};

export default UserSettings;
