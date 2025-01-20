import { useNavigate, Outlet } from 'react-router-dom';
import './style.css';
import SearchBar from '../../components/SearchBar';

const NavigationPage = () => {
    const navigate = useNavigate();

    return (
        
        <div>
            <header class="navigation-header">
                <button onClick={() => navigate('/home')}>Accueil</button>
            </header>
            <SearchBar />
            <Outlet />
        </div>
    );
};

export default NavigationPage;