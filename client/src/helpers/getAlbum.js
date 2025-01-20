import { API_URL } from "../constants";

export const fetchAlbum = async (id) => {
    try {
        const response = await fetch(API_URL + `albums/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching search results:", error);

        return new Promise((resolve,) => {
            resolve({
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
                        id: 12,
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
                        id: 52,
                    },
                ],
            });
        });
    }
};
