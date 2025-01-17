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
				<a href="/" class={url == '/' && 'active'} style={buttonstyle} >
					💿 Page de connexion
				</a>
			</nav>
			
			<nav>
				<a href="/app" class={url == '/app' && 'active'} style={buttonstyle}>
					🎵 Musique
				</a>
			</nav>
			<nav>
				<a href="/profile" class={url == '/profile' && 'active'} style={buttonstyle}>
					⚙️ Profil
				</a>
			</nav>
			</div>
		</header>
	);
}
