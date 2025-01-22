import { API_URL } from "../constants";

export const top = async (topcount) => {
    try {
        const response = await fetch(API_URL + `musics/app/top/${topcount}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching search results:", error);
    }
};