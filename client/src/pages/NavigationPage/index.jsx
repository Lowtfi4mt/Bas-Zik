import { useNavigate, Outlet } from 'react-router-dom';
import './style.css';
import SearchBar from '../../components/SearchBar';

const NavigationPage = () => {
    const navigate = useNavigate();

    return (
        
        <div className="navigation-page">
            <header className="navigation-header">
                <button onClick={() => navigate('/home')}>Accueil</button>
                <SearchBar />
            </header>
            <div className="navigation-content">
                <Outlet />
            </div>
        </div>
    );
};

export default NavigationPage;