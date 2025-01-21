import { API_URL } from "../constants";

export const aleatoire = async (count) => {
    try {
        const response = await fetch(API_URL + `musics/app/random/${count}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
};