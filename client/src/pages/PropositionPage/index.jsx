import { useState } from 'preact/hooks';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { fetchSimilarProposals, finalizeProposal } from '../../helpers/propositions';

export function PropositionPage() {
    const navigate = useNavigate();

    // Form state
    const [musicName, setMusicName] = useState('');
    const [artist, setArtist] = useState('');
    const [album, setAlbum] = useState('');
    const [isNewProposal, setIsNewProposal] = useState(true);

    // Popup state
    const [proposals, setProposals] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);

    const handleValidate = async () => {
        if (!musicName || !artist || !album) {
            alert('Tous les champs doivent être remplis.');
            return;
        }

        // Appel à une fonction externe pour récupérer les propositions similaires
        // Remplacez cette partie par votre appel API réel
        const similarProposals = await fetchSimilarProposals(musicName);

        setProposals(similarProposals);
        setIsPopupOpen(true);
    };

    const handleSelectProposal = (proposal) => {
        setSelectedProposal(proposal);
    };

    const handleFinalize = async () => {
        const result = await finalizeProposal(selectedProposal || { name: musicName, artist, album }, isNewProposal);
        if (result) {
            navigate('/home');
        } else {
            alert("Erreur lors de la validation de la proposition.");
        }
    };

    return (
        <div className="proposition-page">
            <h1>Proposez une musique</h1>
            <form className="proposition-form">
                <div className="form-group">
                    <label htmlFor="musicName">Nom de la musique :</label>
                    <input
                        id="musicName"
                        type="text"
                        value={musicName}
                        onChange={(e) => setMusicName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="artist">Artiste :</label>
                    <input
                        id="artist"
                        type="text"
                        value={artist}
                        onChange={(e) => setArtist(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="album">Album :</label>
                    <input
                        id="album"
                        type="text"
                        value={album}
                        onChange={(e) => setAlbum(e.target.value)}
                    />
                </div>
                <div className="proposition-buttons">
                    <button type="button" class="cancel-button" onClick={() => navigate('/home')}>
                        Annuler
                    </button>
                    <button type="button" class="validate-button" onClick={handleValidate}>
                        Valider
                    </button>
                </div>
            </form>

            {isPopupOpen && (
                <div className="popup">
                    <h2>Propositions similaires</h2>
                    <ul className="proposals-list">
                        {proposals.map((proposal, index) => {console.log(proposal); return (
                            <li
                                key={index}
                                className={`proposal-item ${
                                    selectedProposal === proposal ? 'selected' : ''
                                }`}
                                onClick={() => handleSelectProposal(proposal)}
                            >
                                <strong>{proposal.title}</strong> - {proposal.authors[0].name} ({proposal.albums[0].name})
                                <button onClick={() => { setIsNewProposal(false); handleSelectProposal(proposal); }} className="validate-button">
                                    Choisir celle-ci
                                </button>
                            </li>
                        )})}
                    </ul>
                    <div className="popup-buttons">
                        <button onClick={() => setIsPopupOpen(false)} class="cancel-button">Annuler</button>
                        <button onClick={handleFinalize} class="validate-button">Valider ma proposition</button>
                    </div>
                </div>
            )}
        </div>
    );
}
