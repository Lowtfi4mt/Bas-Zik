import { useState, useEffect } from "preact/hooks";
import "./Card.css";
import { REMOTE_STORAGE_URL, API_URL } from "../constants";
import durationFormat from "../helpers/durationDisplay";
import { Link } from "react-router-dom";
import { useProfile } from "../contexts/ProfileContext";

const MusicCardVote = ({ music }) => {
    const { profile, setProfile } = useProfile();
    const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;
    let title = music.title;
    let votes=music.votes;

    const infoStyle ={
        color: theme.primary,
        backgroundColor: 'transparent',
    }

    const ensureVotesExist = () => {
        if (profile && !profile.votes) {
          const updatedProfile = { ...profile, votes: {last_updated: Date.now(), ids: [] }};  // Crée une partie 'votes' vide si elle n'existe pas
          setProfile(updatedProfile);
        }
    };

    ensureVotesExist();

    const handleClick = async (id) => {

        const body = {}

        
        if (profile.votes.ids.includes(music.id)) {

            const url=API_URL+`musics/proposals/${music.id}/unvote`

            try {
                const response = await fetch(url, { 
                    method: 'DELETE', 
                    headers: { 
                    'Content-type': 'application/json'
                    }, 
                    body: JSON.stringify(body)
                });
                const data = await response;
        
                if (response.ok) {
                // Si la requête est réussie
                console.log('Réponse de la requête DELETE:', data);
                } else {
                // Si la requête échoue
                console.error('Erreur avec la requête DELETE:', data);
                }
                const updatedVotes = profile.votes.ids.filter(voteId => voteId !== music.id);
                const updatedProfile = {
                    ...profile,
                    votes: {ids: updatedVotes, last_updated: Date.now()}
                };
            
                setProfile(updatedProfile);

            } catch (error) {
                console.error('Erreur lors de la requête PUT:', error);
            }
        }
        else {

            const url=API_URL+`musics/proposals/${music.id}/vote`

            try {
                // Effectuer la requête PUT
                const response = await fetch(url, { 
                    method: 'PUT', 
                    headers: { 
                    'Content-type': 'application/json'
                    }, 
                    body: JSON.stringify(body)
                });
                const data = await response;
        
                if (response.ok) {
                // Si la requête est réussie
                console.log('Réponse de la requête PUT:', data);
                } else {
                // Si la requête échoue
                console.error('Erreur avec la requête PUT:', data);
                }
                const updatedProfile = {
                    ...profile,
                    votes: {ids: [...profile.votes.ids, id], last_updated: Date.now()}  // Ajoute l'ID de musique et le timestamp
                };
            
                setProfile(updatedProfile);

            } catch (error) {
                console.error('Erreur lors de la requête PUT:', error);
            }
        }
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
                <div className="Vote" style={{color: theme.secondary, backgroundColor: 'white', flex: 0.4, borderRadius: '8px', border: `2px solid ${theme.primary}`, padding: '7px', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center'}} onClick={() => handleClick(music.id)} >
                    
                    {profile.votes.ids.includes(music.id) ? "❤️ Aimé" : "🤍 Voter"}
                </div>
            </div>
        </div>
            
    );
};

export default MusicCardVote;
