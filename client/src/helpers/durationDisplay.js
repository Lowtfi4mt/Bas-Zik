export default function durationFormat(seconds) {
    // Calculer les heures, minutes et secondes
    const hours = Math.floor(seconds / 3600); // 1 heure = 3600 secondes
    const minutes = Math.floor((seconds % 3600) / 60); // 1 minute = 60 secondes
    const secs = seconds % 60;

    // Formater les valeurs pour qu'elles aient toujours deux chiffres
    const pad = (num) => String(num).padStart(2, "0");

    // Retourner le format hh:mm:ss
    if (hours > 0) {
        return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`;
    }
    else {
        return `${pad(minutes)}:${pad(secs)}`;
    }
}
