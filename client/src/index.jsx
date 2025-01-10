import { render, h } from 'preact';
import { LocationProvider, Router, Route } from 'preact-iso';

import { Header } from './components/Header.jsx';
import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import MusicManager from './pages/MusicManager/index.jsx';


import './style.css';
import { useState } from 'preact/hooks';
import defaultProfile from './utils/defaultProfile.json';
<<<<<<< HEAD
import { checkIsProfile } from './helpers/profileCheck.js';
=======
>>>>>>> b61f924 (Implement user profile upload and conditional rendering in App component)

export function App() {
	const [logedIn, setLogedIn] = useState(false);
	const [profile, setProfile] = useState(defaultProfile);

	const handleFileUpload = (file) => {
<<<<<<< HEAD
		const uploadedFile = file.target.files[0];
		if (uploadedFile.type !== 'application/json') {
			alert('Invalid file type. Please upload a JSON file.');
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			const profile = JSON.parse(e.target.result.toString());
			if (!checkIsProfile(profile)) {
				alert('Invalid profile');
				return;			
			}
			setProfile(profile);
			setLogedIn(true);
		}
		reader.readAsText(uploadedFile);
=======
		//read json file and set profile
		const reader = new FileReader();
		reader.onload = (e) => {
			const profile = JSON.parse(e.target.result.toString());
			setProfile(profile);
		}
		reader.readAsText(file.target.files[0]);
		setLogedIn(true);
>>>>>>> b61f924 (Implement user profile upload and conditional rendering in App component)
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
<<<<<<< HEAD
							<Route path='/music' component={() => <MusicManager />} />
=======
>>>>>>> b61f924 (Implement user profile upload and conditional rendering in App component)
							<Route default component={NotFound} />
						</Router>
					</main>
				</LocationProvider>
			)}
		</div>
	);
}

render(<App />, document.getElementById('app'));
