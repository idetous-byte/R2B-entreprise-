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

// Quand la page charge
window.addEventListener('DOMContentLoaded', () => {
    // Écouter les changements en temps réel
    database.ref('r2b_terrains').on('value', (snapshot) => {
        const liste = [];
        snapshot.forEach((childSnapshot) => {
            liste.push({ id: childSnapshot.key, ...childSnapshot.val() });
        });
        afficherTerrainsChef(liste);
    });
});

// Fonction pour envoyer un terrain en ligne
function ajouterTerrainDepuisFormulaire(superficie, localisation, prix) {
    database.ref('r2b_terrains').push({
        superficie: superficie,
        localisation: localisation,
        prix: prix
    }).then(() => {
        alert("Terrain ajouté en ligne avec succès !");
    });
}

function afficherTerrainsChef(liste) {
    const container = document.getElementById('commandes-container'); // Changez l'ID si nécessaire
    if (!container) return;
    container.innerHTML = "";
    liste.forEach((t, i) => {
        container.innerHTML += `
            <div style="border:1px solid #ccc; padding:10px; margin:5px; border-radius:5px; background:white;">
                <p><strong>Terrain ${i+1} :</strong> ${t.localisation} - ${t.prix} FCFA</p>
                <button onclick="supprimerTerrain('${t.id}')" style="background:red; color:white; border:none; padding:5px; cursor:pointer;">Supprimer</button>
            </div>`;
    });
}

function supprimerTerrain(id) {
    database.ref(`r2b_terrains/${id}`).remove();
}
