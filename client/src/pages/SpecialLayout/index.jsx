import { useState } from 'preact/hooks';
import './style.css';
import { Home } from '../Home';
import { NotFound } from '../_404';
import AudioPage from '../AudioPage';
import { MusicList } from '../MusicList';

const SpecialLayout = ({ audioRef , handleNext, handlePrevious, handlePlay }) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const leftContent = setContent(profile.layout.leftPanel);
    const mainContent = setContent(profile.layout.centerPanel); 
    const rightContent = setContent(profile.layout.rightPanel);
    const theme = profile.layout.theme;
    const [isLeftCollapsed, setLeftCollapsed] = useState(false);
    const [isRightCollapsed, setRightCollapsed] = useState(false);

    function setContent(page){
        switch(page){
            case 'Home':
                return Home();
            case 'AudioPage':
                return AudioPage({ audioRef , handleNext, handlePrevious, handlePlay });
            case 'MusicList':
                return MusicList();
        }
    }

    return (
        <div 
        className="layout-container" 
        style={{ backgroundColor: theme.background, color: theme.primary }}
        >
        {/* Left Menu */}
        <div 
            className={`layout-sidebar layout-left ${isLeftCollapsed ? 'collapsed' : ''}`} 
            style={{ backgroundColor: theme.secondary }}
        >
            <button 
            className="toggle-button" 
            onClick={() => setLeftCollapsed(!isLeftCollapsed)}
            >
            {isLeftCollapsed ? '→' : '←'}
            </button>
            {!isLeftCollapsed && leftContent}
        </div>

        {/* Main Content */}
        <div className="layout-main">
            {mainContent}
        </div>

        {/* Right Menu */}
        <div 
            className={`layout-sidebar layout-right ${isRightCollapsed ? 'collapsed' : ''}`} 
            style={{ backgroundColor: theme.secondary }}
        >
            <button 
            className="toggle-button" 
            onClick={() => setRightCollapsed(!isRightCollapsed)}
            >
            {isRightCollapsed ? '←' : '→'}
            </button>
            {!isRightCollapsed && rightContent}
        </div>
        </div>
    );
};

export default SpecialLayout;
