import { API_URL } from "../constants";

async function fetchSimilarProposals(musicName) {
    console.log(`${API_URL}/musics/proposals/search/${musicName}/fuzzy/70`);
    // Fetch similar songs from the API
    const response = await fetch(`${API_URL}/musics/proposals/search/${musicName}/fuzzy/70`);
    return await response.json();
}

async function finalizeProposal(proposal, isNewProposal) {
    if (isNewProposal) {
        const authors = [];
        for (const author of proposal.artist.split(', ')) {
            authors.push({ name: author });
        }

        const music = {
            title: proposal.name,
            authors: authors,
            albums: [{name: proposal.album}],
        };
            // Create a new proposal
        const response = await fetch(`${API_URL}/musics/proposals/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(music),
        });
        return response.ok;
    }
    else {
        //vote for this proposition
        const response = await fetch(`${API_URL}/musics/proposals/${proposal.id}/vote`, {
            method: 'PUT',
        });
    }
    return true;
}

export { fetchSimilarProposals, finalizeProposal };