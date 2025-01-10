import { render, h } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import './style.css';
import { useState } from 'preact/hooks';
import defaultProfile from './utils/defaultProfile.json';

export function App() {
	const [logedIn, setLogedIn] = useState(false);
	const [profile, setProfile] = useState(defaultProfile);

	const handleFileUpload = (file) => {
		//read json file and set profile
		const reader = new FileReader();
		reader.onload = (e) => {
			const profile = JSON.parse(e.target.result.toString());
			setProfile(profile);
		}
		reader.readAsText(file.target.files[0]);
		setLogedIn(true);
	  };

	return (
		<div>
			{!logedIn ? (
				<div>
					<button onClick={() => setLogedIn(true)}>Profil invité</button>
					<input type="file" onChange={(e) => handleFileUpload(e)} />
				</div>
			) : (
				<LocationProvider>
					<Header />
					<main>
						<Router>
							<Route path="/" component={() => <Home profile={profile} />} />
							<Route default component={NotFound} />
						</Router>
					</main>
				</LocationProvider>
			)}
		</div>
	);
}

render(<App />, document.getElementById('app'));
