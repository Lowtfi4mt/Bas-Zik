export function checkIsProfile (profile) {
    if (
        profile.username &&
        profile.layout &&
        profile.layout.theme &&
        profile.layout.theme.primary &&
        profile.layout.theme.secondary &&
        profile.layout.theme.background &&
        profile.layout.centerPanel &&
        profile.layout.rightPanel &&
        profile.layout.leftPanel &&
        profile.playlists &&
        profile.playlists.length > 0 &&
        profile.votes &&
        profile.votes.ids &&
        profile.votes.last_updated
      ) {
        return true;
      }
      return false;

}