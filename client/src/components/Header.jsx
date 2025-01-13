import { useLocation } from 'preact-iso';

export function Header() {
	const { url } = useLocation();

	return (
		<header>
			<nav>
				<a href="/" class={url == '/' && 'active'}>
					Welcome
				</a>
				<a href="/home" class={url == '/404' && 'active'}>
					home
				</a>
				<a href="/music" class={url == '/music' && 'active'}>
					Music
				</a>
			</nav>
		</header>
	);
}
