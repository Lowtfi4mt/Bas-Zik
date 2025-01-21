//const apiUrl = import.meta.env.API_PATH;
const apiUrl = 'http://localhost:5000';


async function fetchSimilarProposals(musicName, artist, album) {
    console.log(`${apiUrl}/musics/proposals/search/${musicName}/fuzzy/70`);
    // Fetch similar songs from the API
    const response = await fetch(`${apiUrl}/musics/proposals/search/${musicName}/fuzzy/70`);
    console.log(response);
    const data = await response.json();
    console.log(data);
    const result = [];
    for (const music of data) {
        result.push({
            name: music.title,
            artist: music.authors.join(', '),
            album: music.albums[0],
            id: music.id,
        });
    }
    return result;
}

async function finalizeProposal(proposal, isNewProposal) {
    const authors = [];
    for (const author of proposal.artist.split(', ')) {
        authors.push({ name: author });
    }

    const music = {
        title: proposal.name,
        authors: authors,
        albums: [{name: proposal.album}],
    };
    console.log(music);
    if (isNewProposal) {
        // Create a new proposal
        const response = await fetch(`${apiUrl}/musics/proposals`, {
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
        const response = await fetch(`${apiUrl}/musics/proposals/${proposal.id}/vote`, {
            method: 'PUT',
        });
    }
    return true;
}

export { fetchSimilarProposals, finalizeProposal };