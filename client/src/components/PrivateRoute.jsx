import { h } from 'preact';
import { useProfile } from '../helpers/ProfileContext';
import { route } from 'preact-router'; // Equivalent de Navigate pour Preact
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  if (typeof Component !== 'function') {
    throw new Error('Invalid component passed to ProtectedRoute');
  }
  const { profile } = useProfile();
  console.log('profile :', profile);

  // Vérifie si l'utilisateur est authentifié
  if (!profile) {
    // Redirige vers la page d'accueil si non authentifié
    return <Navigate to="/" replace />;// Empêche l'affichage du composant protégé
  }

  // Si authentifié, affiche le composant passé en paramètre
  return (<Component {...rest} />);
};

export default ProtectedRoute;
