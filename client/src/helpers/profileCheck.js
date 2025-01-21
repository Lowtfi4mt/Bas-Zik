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
        profile.layout.leftPanel
      ) {
        return true;
      }
      return false;

}