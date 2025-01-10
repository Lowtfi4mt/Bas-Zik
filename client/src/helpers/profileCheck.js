export function checkIsProfile (profile) {
    if (
        profile.username &&
        profile.theme &&
        profile.theme.primaryColor &&
        profile.layout &&
        profile.layout.fontSize
      ) {
        return true;
      }
      return false;

}