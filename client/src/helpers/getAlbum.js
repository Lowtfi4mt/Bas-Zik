import { API_URL } from "../constants";

export const fetchAlbum = async (id) => {
    try {
        const response = await fetch(API_URL + `albums/${id}`);
        const data = await response.json();
        return {
            id: data.id,
            name: data.name,
            authors: data.authors,
            app_musics: data.app_musics.map((music) => ({
                ...music,
                authors: data.authors,
                albums: [{
                    id: data.id,
                    name: data.name,
                }],
            })),
        };
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
};
