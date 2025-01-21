import { useLocation } from 'preact-iso';
import { Link } from 'react-router-dom';

export function Header() {
	const { url } = useLocation();

	const profile = JSON.parse(localStorage.getItem('profile'));

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
					<Link to="/" className={url == '/' && 'active'} style={buttonstyle} >
						💿 Page de connexion
					</Link>
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
