import './style.css';

export function Album() {

    const theme = JSON.parse(localStorage.getItem('profile')).layout.theme;
    const trackstyle = {
        backgroundColor: theme.background,
        borderColor: 'black',
    }

    const mockTracks = [
        {
          id: 1,
          title: "Stairway to Heaven",
          artist: "Led Zeppelin",
          },
        {
          id: 2,
          title: "Bohemian Rhapsody",
          artist: "Queen",
        },
        {
          id: 3,
          title: "Hotel California",
          artist: "Eagles",
        },
        {
          id: 4,
          title: "Imagine",
          artist: "John Lennon",
        },
        {
          id: 5,
          title: "Smells Like Teen Spirit",
          artist: "Nirvana",
        },
        {
          id: 6,
          title: "Billie Jean",
          artist: "Michael Jackson",
        },
        {
          id: 7,
          title: "Purple Rain",
          artist: "Prince",
        },
        {
          id: 8,
          title: "Sweet Child O' Mine",
          artist: "Guns N' Roses",
        },
        {
          id: 9,
          title: "Like a Rolling Stone",
          artist: "Bob Dylan",
        },
        {
          id: 10,
          title: "Hey Jude",
          artist: "The Beatles",
        },
      ];
      

  return (
    <div className="album-container">
      {/* Partie gauche */}
      <div style={{backgroundColor: theme.background}} className="left-section">
        <img src='../../public/BasZicLogo.png' alt={`Album cover`} className="album-cover" />
        <h1 className="album-title">Album</h1>
        <h2 className="artist-name">Artiste</h2>
      </div>

      {/* Partie droite */}
      <div className="right-section">
        <div className="tracklist-title">
        <div className="listTitle"> <h3 className="tracklist-title">Liste des Titres</h3> </div>
        <div className="listenAll" style={{color: theme.primary}}> <div className="listenAllButton">  ▶️  Ecouter l'album </div> </div> </div>
        <ul className="tracklist">
        {mockTracks.map((track) => (
        <div key={track.id} style={trackstyle} className="track">
            <div style={{color: theme.primary}} className="trackinfo">
                <h3>{track.title}</h3>
                <h4> Artist: {track.artist} </h4>
            </div>
            <div style={{color: theme.secondary}} className="tracklisten"> <div className="listen">
             ▶️  Ecouter
            </div>
            </div>
        </div>
      ))}
        </ul>
      </div>
    </div>
  );
}
