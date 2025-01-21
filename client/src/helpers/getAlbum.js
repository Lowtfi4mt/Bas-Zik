import { API_URL } from "../constants";

export const fetchAlbum = async (id) => {
    try {
        const response = await fetch(API_URL + `albums/${id}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
};
