import { Fragment } from 'preact/jsx-runtime';
import SearchBar from '../../components/SearchBar';
import './style.css';

export default function NavigationHome() {
    return (
        <div>
            <SearchBar />
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p>ici se trouve la page de navigation</p>
            </div>
        </div>
    );
}