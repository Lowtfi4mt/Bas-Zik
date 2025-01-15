import { useLocation } from 'preact-iso';

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
				<a href="/home" class={url == '/404' && 'active'} style={buttonstyle}>
					🏠 Accueil
				</a>
			</nav>
			<nav>
				<a href="/music" class={url == '/music' && 'active'} style={buttonstyle}>
					🎵 Musique
				</a>
			</nav>
			<nav>
				<a href="/layout" class={url == '/layout' && 'active'} style={buttonstyle}>
					💿 Table de mixage
				</a>
			</nav>
			<nav style={{
        marginLeft: 'auto',
      }}>
				<a href="/" class={url == '/' && 'active'} style={buttonstyle} >
					⬅️ Déconnexion
				</a>
			</nav>
			</div>
		</header>
	);
}
