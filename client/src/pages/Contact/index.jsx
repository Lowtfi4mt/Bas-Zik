import { Header } from '../../components/Header';
import './style.css';

const Contact = () => {
    return (
        <div>
            <Header />
            <div>
                <h1>Contact</h1>
                <p>Bas'Zik est un projet de 5 étudiants d'IMT Atlantique visant à tester s'il est possible de concevoir de manière lowtech des 
                    logiciels de qualité comme ce site de musique en ligne. 
                </p>
                <p>Vous avez une question ou une suggestion ?</p>
                <p>Vous pouvez nous contacter aux l'adresses suivantes :</p>
                <div>
                    <a href="mailto:felipe.lobato@imt-atlantique.net">felipe.lobato@imt-atlantique.net</a><br />
                    <a href="mailto:estelle.marguinaud@imt-atlantique.net">estelle.marguinaud@imt-atlantique.net</a><br />
                    <a href="mailto:jean-baptiste.lambertin@imt-atlantique.net">jean-baptiste.lambertin@imt-atlantique.net</a><br />
                    <a href="mailto:antoine.cheucle@imt-atlantique.net">antoine.cheucle@imt-atlantique.net</a><br />
                    <a href="mailto:nathan.claeys@imt-atlantique.net">nathan.claeys@imt-atlantique.net</a>
                </div>
            </div>
        </div>
    );
};

export default Contact;