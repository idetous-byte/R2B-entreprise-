// Connexion à VOTRE Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA94jSfi5m_aSDUDOSE5s66mwoFF6Bj8FU",
  authDomain: "://firebaseapp.com",
  databaseURL: "https://firebaseio.com",
  projectId: "r2b-entreprise",
  storageBucket: "://appspot.com",
  messagingSenderId: "614614560237",
  appId: "1:614614560237:web:6ca754bde319f587590be4"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let terrainSelectionne = null;

// 1. GESTION DU SPLASH SCREEN
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => { splash.style.visibility = 'hidden'; }, 500);
        }
    }, 3000);
    
    // Écouter la base de données en direct
    database.ref('r2b_terrains').on('value', (snapshot) => {
        const liste = [];
        snapshot.forEach((childSnapshot) => {
            liste.push(childSnapshot.val());
        });
        chargerTerrainsClient(liste);
    });
});

// 2. AFFICHAGE DES TERRAINS EN GRILLE
function chargerTerrainsClient(liste) {
    const container = document.getElementById('terrains-container');
    if (!container) return;
    if (liste.length === 0) {
        container.innerHTML = "<p style='text-align:center; grid-column:1/-1;'>Aucun terrain disponible.</p>";
        return;
    }
    container.innerHTML = "";
    liste.forEach((t, i) => {
        container.innerHTML += `
        <div class="card-terrain">
            <h2>Terrain ${i + 1}</h2>
            <div class="info-line"><strong>Superficie :</strong> ${t.superficie}</div>
            <div class="info-line"><strong>Localisation :</strong> ${t.localisation}</div>
            <div class="price-line">${t.prix} FCFA</div>
            <button onclick="ajouterAuPanier(${i}, '${t.localisation}', '${t.prix}')" class="btn-order">Commander</button>
        </div>`;
    });
}

// Laissez le reste de vos fonctions ajouterAuPanier(), ouvrirPanier() et validerEtEnvoyerCommande() en dessous !

