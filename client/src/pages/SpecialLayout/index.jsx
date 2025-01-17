import { useState } from 'preact/hooks';
import './style.css';
import AudioPage from '../AudioPage';
import { MusicList } from '../MusicList';
import NavigationPage from '../NavigationPage';

const SpecialLayout = ({ audioRef, playlist , handleNext, handlePrevious, handlePlay }) => {
    const profile = JSON.parse(localStorage.getItem('profile'));
    const leftContent = setContent(profile.layout.leftPanel);
    const mainContent = setContent(profile.layout.centerPanel); 
    const rightContent = setContent(profile.layout.rightPanel);
    const theme = profile.layout.theme;
    const [isLeftCollapsed, setLeftCollapsed] = useState(false);
    const [isRightCollapsed, setRightCollapsed] = useState(false);

    function setContent(page){
        switch(page){
            case 'NavigationPage':
                return NavigationPage();
            case 'AudioPage':
                return AudioPage({ audioRef , handleNext, handlePrevious, handlePlay });
            case 'MusicList':
                return MusicList({playlist});
        }
    }

    return (
        <div 
        className="layout-container" 
        >
        {/* Left Menu */}
        <div 
            className={`layout-sidebar layout-left ${isLeftCollapsed ? 'collapsed' : ''}`} 
        >
            {!isLeftCollapsed && leftContent}
            <div className="layout-sidebar-header" style={{ backgroundColor: theme.primary }}>
                <button 
                className="toggle-button" 
                style={{ backgroundColor: theme.secondary }}
                onClick={() => setLeftCollapsed(!isLeftCollapsed)}
                >
                    {isLeftCollapsed ? '→' : '←'}
                </button>
            </div>
        </div>

        {/* Main Content */}
        <div className="layout-main">
            {mainContent}
        </div>

        {/* Right Menu */}
        <div 
            className={`layout-sidebar layout-right ${isRightCollapsed ? 'collapsed' : ''}`} 
        >
            <div className="layout-sidebar-header" style={{ backgroundColor: theme.primary }}>
                <button 
                className="toggle-button" 
                style={{ backgroundColor: theme.secondary }}
                onClick={() => setRightCollapsed(!isRightCollapsed)}
                >
                {isRightCollapsed ? '←' : '→'}
                </button>
            </div>
            {!isRightCollapsed && rightContent}
        </div>
        </div>
    );
};

export default SpecialLayout;
