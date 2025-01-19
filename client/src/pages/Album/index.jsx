import { useEffect, useState } from "preact/hooks";
import { API_URL } from "../../constants";
import { useParams } from "react-router-dom";
import MusicCard from "../../components/MusicCard";
import { Link } from "react-router-dom";

const Album = () => {
    const [results, setResults] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(API_URL + `albums/${id}`);
                const data = await response.json();
                setResults(data.results);
            } catch (error) {
                console.error("Error fetching search results:", error);
            }
        };

        fetchResults();

        setResults({
            title: "Ceci est un album",
            authors: ["Léo Ferré"],
            authorsId: [56],
            musicCount: 152,
            musics: [
                {
                    title: "J'Avais Un Pense-Bête",
                    path: "public/-3hDYqy7KX4",
                    authors: ["Léo Ferré"],
                    authorsId: [56],
                    albums: ["Amour Anarchie"],
                    albumsId: [78],
                    duration: 185,
                    likes: 123,
                    id: 12
                },
                {
                    title: "One Last Game",
                    path: "public/-VmQ5jf3eyo",
                    authors: ["Blabla"],
                    authorsId: [56],
                    albums: ["Blibli"],
                    albumsId: [78],
                    duration: 642,
                    likes: 64,
                    id: 52
                }   
            ]             
        });
    }, [id]);

    return (
        <div style={{ padding: "20px" }}>
            {
                results ? (
                    <div>
                        <h1>Page d&apos;album &bull; {results.title}</h1>
                        <h2>{results.authors.length > 0 ? (
                        results.authors.map((author, index) => (
                            <span key={index}>
                                <Link to={`/artist/${results.authorsId[index]}`}>
                                    {author}
                                </Link>
                                {index < results.authors.length - 1 && " et "}
                            </span>
                        ))
                    ) : (
                        <span>Artiste inconnu</span>
                    )}  &bull;  {results.musicCount} titres</h2>
                        <h2>Titres</h2>
                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {results.musics.map((music) => (
                                <MusicCard key={music.id} music={music} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Loading...</p>
                )
            }
        </div>
    );
};

export default Album;
