import { createContext } from 'preact';
import { useContext, useEffect, useState } from 'preact/hooks';

const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(() => {
    const profileData = localStorage.getItem('profile');
    return profileData ? JSON.parse(profileData) : null;
  });

  useEffect(() => {
    if (profile) {
      localStorage.setItem('profile', JSON.stringify(profile)); // Sérialiser l'objet
    } else {
      localStorage.removeItem('profile');
    }
  }, [profile]);

  const login = (profileData) => {
    setProfile(profileData);
  };

  const logout = () => {
    setProfile(null);
    localStorage.removeItem('profile');
  };

  return (
    <ProfileContext.Provider value={{ profile, setProfile, login, logout }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  return useContext(ProfileContext);
};
