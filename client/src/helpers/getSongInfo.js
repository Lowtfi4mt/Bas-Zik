import { REMOTE_STORAGE_URL } from "../constants";

export default async function getSongInfo(songId) {
    try {
        const response = await fetch(REMOTE_STORAGE_URL + songId + ".json"); // Remplacez par votre URL
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error("Error fetching data: ", err);
    }
}
