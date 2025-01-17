import { useNavigate } from 'react-router-dom';
import './style.css';

const NavigationPage = () => {
    const navigate = useNavigate();

    const navigateToHome = () => {
        navigate('/home');
    };

    return (
        <div>
            <button onClick={navigateToHome}>Accueil</button>
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>ici se trouve la page de navigation</p>
            </div>
        </div>
    );
};

export default NavigationPage;