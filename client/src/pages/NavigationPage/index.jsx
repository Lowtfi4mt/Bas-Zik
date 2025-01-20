import { BrowserRouter as Router, Routes, Route, useNavigate, Outlet } from 'react-router-dom';
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
                <button onClick={() => navigate('/app/search')}>page blanche</button>
                <button onClick={() => navigate('/app/results')}>Rechercher</button>
            </header>
            <Outlet />
        </div>
    );
};

export default NavigationPage;