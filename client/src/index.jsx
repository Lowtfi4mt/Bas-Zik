import { render, h } from 'preact';

import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import MusicManager from './pages/MusicManager/index.jsx';
import ProtectedRoute from './components/PrivateRoute.jsx';
import { Welcome } from './pages/Welcome/index.jsx';
import { ProfileProvider } from './contexts/ProfileContext.jsx';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserSettings from './pages/UserSettings/index.jsx';
import Contact from './pages/Contact/index.jsx';
import { PropositionPage } from './pages/PropositionPage/index.jsx';
import SearchResults from './pages/SearchResults/index.jsx';
import Artist from './pages/Artist/index.jsx';
import Album from './pages/Album/index.jsx';
import { PlaylistProvider } from './contexts/PlaylistContext.jsx';
import NavigationHome from './pages/NavigationHome/index.jsx';
import Playlist from './pages/Playlist/index.jsx';

export function App() {
  return (
    <ProfileProvider>
      <PlaylistProvider>
        <main>
          <Router>
			<Routes>
				<Route path="/" Component={Welcome} />
				<Route path="/home" Component={() => <ProtectedRoute component={Home} />} />
        <Route path="/profile" Component={() => <ProtectedRoute component={UserSettings} />} />
				<Route path="/app" Component={() => <ProtectedRoute component={MusicManager} />} >
          <Route path="" Component={NavigationHome} />
          <Route path="search" Component={SearchResults} />
          <Route path='artist/:id' Component={() => <ProtectedRoute component={Artist} />} />
          <Route path='album/:id' Component={() => <ProtectedRoute component={Album} />} />
          <Route path='playlist/:id' Component={() => <ProtectedRoute component={Playlist} />} />
        </Route>
        <Route path="/contact" Component={() => <ProtectedRoute component={Contact} />} />
        <Route path='/propose' Component={() => <ProtectedRoute component={PropositionPage} />} />
				<Route default Component={NotFound} />
			</Routes>
          </Router>
        </main>
      </PlaylistProvider>
    </ProfileProvider>
  );
}

render(<App />, document.getElementById('app'));
