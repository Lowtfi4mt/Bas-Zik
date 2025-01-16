import { Header } from '../../components/Header';
import './style.css';

export function Home () {
	const profile = JSON.parse(localStorage.getItem('profile'));
	return (
	<>
	  <Header/>
	  <div>
		<h2 style={{ color: profile.layout.theme.secondary }}>User Information</h2>
		<p>Username: {profile.username}</p>
	  </div>
	</>
	);
  };
