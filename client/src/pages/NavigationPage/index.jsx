import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './style.css';
import SearchBar from '../../components/SearchBar';
import SearchResults from '../SearchResults';
import Artist from '../Artist';
import Album from '../Album';
import NavigationHome from '../NavigationHome';

const NavigationPage = () => {
    const navigate = useNavigate();

    return (
        
        <div>
            <header class="navigation-header">
                <button onClick={() => navigate('/home')}>Accueil</button>
                <button onClick={() => navigate('/app/')}>page blanche</button>
                <button onClick={() => navigate('/app/results')}>Rechercher</button>
            </header>
            <div>
                <Routes>
                    <Route path="" Component={NavigationHome} />
                    <Route path='results' Component={SearchResults} />
                    <Route path='artist/:id' Component={Artist} />
                    <Route path='album/:id' Component={Album} />
                </Routes>
            </div>
        </div>
    );
};

export default NavigationPage;