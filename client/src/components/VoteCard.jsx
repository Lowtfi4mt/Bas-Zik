import { useState, useEffect } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL } from "../constants";
import durationFormat from "../helpers/durationDisplay";
import { Link } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";

const MusicCardVote = ({ music }) => {
    const { profile, setProfile } = useProfile();
    const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;
    let title = music.title;
    let votes=music.votes;
    let vote=true;

    const [clicked, setClicked] = useState(false);

    const infoStyle ={
        color: theme.primary,
        backgroundColor: 'transparent',
    }

    const handleClick = () => {
        setClicked(!clicked);
        console.log('Div cliquée!');
      };

    return (
        <div>
            <div className={`music-card`} 
            style={{backgroundColor: theme.background, display: 'flex'}}>
                {/* Infos principales */}
                <div className="music-info" style={infoStyle}  >
                    <h3 className="music-title">{title}</h3>
                    <p className="music-meta" style={{color: theme.secondary}}>
                        {music.authors.length > 0 ? (
                            music.authors.map((author, index) => (
                                <span key={author.id}>
                                    <Link to={`/app/artist/${author.id}`}>
                                        <a class="music-author">{author.name}</a>
                                    </Link>
                                    {index < music.authors.length - 1 && " et "}
                                </span>
                            ))
                        ) : (
                            <span>Artiste inconnu</span>
                        )}
                        &bull; {
                            music.albums.length > 0 ? (
                                music.albums.map((album, index) => (
                                    <span key={index}>
                                        <Link to={`/app/album/${music.albumsId[index]}`}>
                                            {album}
                                        </Link>
                                        {index < music.albums.length - 1 && " et "}
                                    </span>
                                ))
                            ) : (
                                <span>Album inconnu</span>
                            )
                        }
                    </p>
                    <p className="music-stats" style={{color: theme.secondary}}>
                        <span>{votes} votes</span>
                    </p>
                </div>
                <div className="Vote" style={{color: theme.secondary, backgroundColor: 'white', flex: 0.4, borderRadius: '8px', border: `2px solid ${theme.primary}`, padding: '7px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}} onClick={handleClick} >
                    {clicked ? "❤️ Liké" : "🤍 Voter"}
                </div>
                {/* Boutons d'action */}
                <div className="music-actions">
                </div>
            </div>
        </div>
            
    );
};

export default MusicCardVote;
