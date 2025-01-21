import { Header } from '../../components/Header';
import './style.css';
import { top } from '../../helpers/top10';
import { useState, useEffect } from 'preact/hooks';
import MusicCard from "../../components/MusicCard";

export function Home () {
	const profile = JSON.parse(localStorage.getItem('profile'));
	const theme = profile.layout.theme;

	const [tops, setTops] = useState(null); // État pour stocker les données de `top`

    useEffect(() => {
        const fetchTop = async () => {
            const data = await top(10); // Appel à la fonction asynchrone
            setTops(data); // Mise à jour de l'état
        };
        fetchTop(); // Exécution de la fonction au montage du composant
    }, []);

	return (
	<>
	  <Header/>
	  <div className="container-ext">
		<div className="composant"> <div className="titre">
			<div className="titre-section" style={{ color: profile.layout.theme.secondary }}>Top 10</div>
			<div className="listenAll" style={{color: theme.primary}}><div className="listenTop"> ▶️  Ecouter tout</div></div>
		</div>
		<div>{tops ? ( tops.map((music) => (
                                <MusicCard key={music.id} music={music} />
                            ))
                        ) : (
                            <p>Chargement...</p> // Message de chargement
                        )}</div>
						</div>
		<div className="composant"> <div className="titre">
			<div className="titre-section" style={{ color: profile.layout.theme.secondary }}>Mes listes de lecture</div>
			<div className="listenAll" style={{color: theme.primary}}><div className="newList"> + Nouvelle liste</div></div></div>
				
		</div>
		<div className="composant"> <div className="titre">
			<div className="titre-section" style={{ color: profile.layout.theme.secondary }}>Top Propositions</div>
			<p style={{color: theme.secondary}}>N'oublie pas de voter pour les prochaines musiques sur la plateforme !!</p>
		</div></div>
	  </div>
	</>
	);
  };
