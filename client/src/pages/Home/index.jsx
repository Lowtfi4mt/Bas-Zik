import preactLogo from '../../assets/preact.svg';
import './style.css';

export function Home ({ profile }) {
	return (
	  <div>
		<h2 style={{ color: profile.theme.secondaryColor }}>User Information</h2>
		<p>Username: {profile.username}</p>
		<p>Header Visible: {profile.layout.headerVisible ? 'Yes' : 'No'}</p>
		<p>Sidebar Visible: {profile.layout.sidebarVisible ? 'Yes' : 'No'}</p>
		<p>Font Size: {profile.layout.fontSize}</p>
	  </div>
	);
  };
