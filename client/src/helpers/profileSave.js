import { checkIsProfile } from "./profileCheck";

export function saveProfile(profile) {
  if (!checkIsProfile(profile)) {
    return false
  }
  localStorage.setItem("profile", JSON.stringify(profile));
  return true;
}