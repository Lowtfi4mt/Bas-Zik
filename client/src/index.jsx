import { render, h } from 'preact';

import { Home } from './pages/Home/index.jsx';
import { NotFound } from './pages/_404.jsx';
import MusicManager from './pages/MusicManager/index.jsx';
import ProtectedRoute from './components/PrivateRoute.jsx';
import { Welcome } from './pages/Welcome/index.jsx';
import { ProfileProvider } from './helpers/ProfileContext';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SpecialLayout from './pages/SpecialLayout/index.jsx';
import UserSettings from './pages/UserSettings/index.jsx';

export function App() {
  return (
    <ProfileProvider>
        <main>
          <Router>
			<Routes>
				<Route path="/" Component={Welcome} />
				<Route path="/home" Component={() => <ProtectedRoute component={Home} />} />
        <Route path="/profile" Component={() => <ProtectedRoute component={UserSettings} />} />
				<Route path="/music" Component={() => <ProtectedRoute component={MusicManager} />} />
				<Route path="/layout" Component={() => <ProtectedRoute component={SpecialLayout} />} />
				<Route default Component={NotFound} />
			</Routes>
          </Router>
        </main>
    </ProfileProvider>
  );
}

render(<App />, document.getElementById('app'));
