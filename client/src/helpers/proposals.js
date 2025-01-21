import { API_URL } from "../constants";

export const proposals = async (topcount) => {
    try {
        const response = await fetch(API_URL + `musics/proposals/`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
};