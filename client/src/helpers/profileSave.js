import { checkIsProfile } from "./profileCheck";

export function saveProfile(profile) {
  if (!checkIsProfile(profile)) {
    return false
  }
  if (localStorage.getItem("profile") !== profile) {
    localStorage.removeItem("profile");
    localStorage.setItem("profile", JSON.stringify(profile));
  }
  return true;
}