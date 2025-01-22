import { useLocation } from 'preact-iso';
import { Link, useNavigate } from 'react-router-dom';
import { useProfile } from '../contexts/ProfileContext';

export function Header() {
	const { url } = useLocation();
	const navigate = useNavigate();

	const { profile } = useProfile();

	const handleDisconnect = () => {
		localStorage.removeItem('profile');
		navigate('/');
	}

	const buttonstyle = {
		display: 'inline-block',
		padding: '10px 20px',
		border: `2px solid ${profile.layout.theme.primary}`,
		borderRadius: '5px',
		color: profile.layout.theme.primary,
		backgroundColor: 'white',
		textDecoration: 'none',
		transition: 'all 0.3s ease',
	}

		return (
			<header>
				<div
				style={{
				display: 'flex',
				gap: '20px',
				padding: '20px',
				flexWrap: 'wrap',
				backgroundColor: profile.layout.theme.background,
				}}
				>
				<nav>
					<button onClick={handleDisconnect} className={url == '/' && 'active'} style={buttonstyle} >
						💿 Déconnexion
					</button>
				</nav>
				
				<nav>
					<Link to="/app" className={url == '/app' && 'active'} style={buttonstyle}>
						🎵 Musique
					</Link>
				</nav>
				
				<nav>
					<Link to="/propose" className={url == '/propose' && 'active'} style={buttonstyle}>
						🎶 Proposition
					</Link>
				</nav>
				<nav>
					<Link to="/profile" className={url == '/profile' && 'active'} style={buttonstyle}>
						⚙️ Profil
					</Link>
				</nav>
				<nav>
					<Link to="/contact" className={url == '/contact' && 'active'} style={buttonstyle}>
						📞 Contact
					</Link>
				</nav>
				</div>
			</header>
		);
}
