import { Header } from '../../components/Header';
import './style.css';

export function Home () {
	const profile = JSON.parse(localStorage.getItem('profile'));
	const theme = profile.layout.theme;
	return (
	<>
	  <Header/>
	  <div className="container-ext">
		<div className="composant"> <div className="titre">
			<div className="titre-section" style={{ color: profile.layout.theme.secondary }}>Top 10</div>
			<div className="listenAll" style={{color: theme.primary}}><div className="listenTop"> ▶️  Ecouter tout</div></div>
		</div></div>
		<div className="composant"> <div className="titre">
			<div className="titre-section" style={{ color: profile.layout.theme.secondary }}>Mes listes de lecture</div>
			<div className="listenAll" style={{color: theme.primary}}><div className="newList"> + Nouvelle liste</div></div>
		</div></div>
		<div className="composant"> <div className="titre">
			<div className="titre-section" style={{ color: profile.layout.theme.secondary }}>Top Propositions</div></div>
			<p style={{color: theme.secondary}} >N'oublie pas de voter pour les prochaines musiques sur la plateforme !!</p>
		</div>
	  </div>
	  {/*<div>
		<h2 style={{ color: profile.layout.theme.secondary }}>User Information</h2>
		<p>Username: {profile.username}</p>
	  </div>
	  <div><h2 style={{ color: profile.layout.theme.secondary }}>User Information</h2>
	  <p>Username: {profile.username}</p></div>*/}
	</>
	);
  };
