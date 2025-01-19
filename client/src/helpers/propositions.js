const apiUrl = import.meta.env.API_PATH;


async function fetchSimilarProposals(musicName, artist, album) {
    return [
        { name: 'Similar Song 1', artist: 'Mock Artist 1', album: 'Mock Album 1' },
        { name: 'Similar Song 2', artist: 'Mock Artist 2', album: 'Mock Album 2' },
        { name: 'Similar Song 3', artist: 'Mock Artist 3', album: 'Mock Album 3' },
    ];
}

async function finalizeProposal(proposal) {
    return true;
}

export { fetchSimilarProposals, finalizeProposal };