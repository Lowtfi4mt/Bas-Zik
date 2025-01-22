import { Header } from "../../components/Header";
import "./style.css";
import { top } from "../../helpers/top10";
import { proposals } from "../../helpers/proposals";
import { aleatoire } from "../../helpers/aleatoire";
import { useState, useEffect } from "preact/hooks";
import MusicCard from "../../components/MusicCard";
import { usePlaylist } from "../../contexts/PlaylistContext";
import MusicCardVote from "../../components/VoteCard";
import { useProfile } from "../../contexts/ProfileContext";
import PlaylistCard from "../../components/PlaylistCard";

export function Home() {
    const { profile } = useProfile();

    const theme = profile.layout.theme;

    const [tops, setTops] = useState(null);
    const [alea, setAlea] = useState(null); // État pour stocker les données de `top`

    const [isAleatoire, setAleatoire] = useState(false);
    const [nombre, setNombre] = useState(10);
    const musiques = isAleatoire ? alea : tops;

    useEffect(() => {
        const fetchTop = async () => {
            const data = await top(nombre);
            setTops(data);
        };
        fetchTop();
    }, [nombre]);

    useEffect(() => {
        const fetchAlea = async () => {
            const data = await aleatoire(nombre);
            setAlea(data);
        };
        fetchAlea();
    }, [nombre]);

    const [listproposals, setProposals] = useState(null);

    useEffect(() => {
        const fetchProposal = async () => {
            const data = await proposals(10);
            setProposals(data.sort((a, b) => b.votes - a.votes));
        };
        fetchProposal();
    }, []);

    const { setPlaylist } = usePlaylist();

    const listenToAll = () => {
        setPlaylist(() => [...musiques]);
    };

    const changeTop = () => {
        setAleatoire(!isAleatoire);
    };

    const handleNombreChange = (e) => {
        const value = Math.max(1, Number(e.target.value)); // Empêche des valeurs négatives ou 0
        setNombre(value);
    };

    return (
        <>
            <div className="container-ext-ext">
                <div className="header">
                    <Header />
                </div>
                <div className="container-ext">
                    <div className="composant">
                        {" "}
                        <div className="titre">
                            <div
                                className="titre-section"
                                style={{
                                    color: profile.layout.theme.secondary,
                                }}
                            >
                                {isAleatoire ? `Aléatoire` : `Top`}
                                <input
                                    type="number"
                                    value={nombre}
                                    onChange={handleNombreChange}
                                    style={{
                                        width: "50px",
                                        marginLeft: "10px",
                                        padding: "2px",
                                        textAlign: "center",
                                        color: theme.primary,
                                        backgroundColor: "transparent",
                                        border: `2px solid ${theme.secondary}`,
                                        borderRadius: "4px",
                                    }}
                                />
                            </div>
                            <div
                                className="button-box"
                                style={{ color: theme.primary }}
                                onClick={changeTop}
                            >
                                <div className="topbutton">
                                    {isAleatoire ? `Top` : `Aléatoire`}
                                </div>
                            </div>
                            <div
                                className="button-box"
                                style={{ color: theme.primary }}
                                onClick={listenToAll}
                            >
                                <div className="topbutton">
                                    {" "}
                                    ▶️ Ecouter tout
                                </div>
                            </div>
                        </div>
                        <div className="topmusics">
                            {musiques ? (
                                musiques.map((music) => (
                                    <MusicCard key={music.id} music={music} />
                                ))
                            ) : (
                                <p>Chargement...</p> // Message de chargement
                            )}
                        </div>
                    </div>
                    <div className="composant">
                        {" "}
                        <div className="titre">
                            <div
                                className="titre-section"
                                style={{
                                    color: profile.layout.theme.secondary,
                                }}
                            >
                                Mes listes de lecture
                            </div>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0px",
                                color: theme.primary,
                            }}
                        >
                            {profile.playlists.map((playlist, index) => (
                                <div key={index}>
                                    <PlaylistCard
                                        playlist={playlist}
                                        index={index}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="composant">
                        {" "}
                        <div className="titre">
                            <div
                                className="titre-section"
                                style={{
                                    color: profile.layout.theme.secondary,
                                }}
                            >
                                Top Propositions{" "}
                            </div>
                        </div>
                        <p style={{ color: theme.secondary }}>
                            N&apos;oublie pas de voter pour les prochaines musiques
                            sur la plateforme !!
                        </p>
                        <div className="topmusics">
                            {listproposals ? (
                                listproposals.map((music) => (
                                    <MusicCardVote
                                        key={music.id}
                                        music={music}
                                    />
                                ))
                            ) : (
                                <p>Chargement...</p> // Message de chargement
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
