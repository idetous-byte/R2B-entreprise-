// ============================================
// FIREBASE R2B ENTREPRISE
// ============================================

const firebaseConfig = {

    apiKey: "AIzaSyA49jSfi5m_aSDUDOSE5s66mwoFF6Bj8FU",

    authDomain: "r2b-entreprise.firebaseapp.com",

    databaseURL:
        "https://r2b-entreprise-default-rtdb.firebaseio.com",

    projectId: "r2b-entreprise",

    storageBucket:
        "r2b-entreprise.firebasestorage.app",

    messagingSenderId: "614614560237",

    appId:
        "1:614614560237:web:6ca754bde319f587590be4",

    measurementId: "G-01TZBXRKBX"
};


// Initialiser Firebase

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();


// ============================================
// VARIABLES
// ============================================

let terrains = [];

let terrainSelectionne = null;


// ============================================
// ÉCRAN DE DÉMARRAGE
// ============================================

window.addEventListener("load", function() {

    setTimeout(function() {

        const splash =
            document.getElementById("splash-screen");

        if (splash) {

            splash.style.opacity = "0";

            setTimeout(function() {

                splash.style.visibility = "hidden";

            }, 500);

        }

    }, 1800);

});


// ============================================
// CHARGER LES TERRAINS DEPUIS FIREBASE
// ============================================

window.addEventListener("DOMContentLoaded", function() {

    database
        .ref("r2b_terrains")
        .on(

            "value",

            function(snapshot) {

                terrains = [];

                snapshot.forEach(function(childSnapshot) {

                    const terrain =
                        childSnapshot.val();

                    terrains.push({

                        id: childSnapshot.key,

                        superficie:
                            terrain.superficie || "",

                        localisation:
                            terrain.localisation || "",

                        prix:
                            terrain.prix || ""

                    });

                });


                afficherTerrains();

            },

            function(error) {

                console.error(
                    "Erreur Firebase :",
                    error
                );

                document.getElementById(
                    "terrains-container"
                ).innerHTML = `

                    <div class="message-vide">

                        Impossible de charger les terrains.

                        <br><br>

                        Vérifiez la connexion Firebase.

                    </div>

                `;

            }

        );

});


// ============================================
// AFFICHER LES TERRAINS
// ============================================

function afficherTerrains() {

    const container =
        document.getElementById(
            "terrains-container"
        );


    if (!container) return;


    container.innerHTML = "";


    if (terrains.length === 0) {

        container.innerHTML = `

            <div class="message-vide">

                Aucun terrain disponible pour le moment.

                <br>

                Terrain indisponible.

            </div>

        `;

        return;

    }


    terrains.forEach(function(t, index) {

        container.innerHTML += `

            <div class="card-terrain">

                <h2>
                    🏡 Terrain ${index + 1}
                </h2>

                <p class="info-line">

                    📐 <strong>Superficie :</strong>

                    ${echapperHTML(t.superficie)}

                </p>

                <p class="info-line">

                    📍 <strong>Localisation :</strong>

                    ${echapperHTML(t.localisation)}

                </p>

                <p class="price-line">

                    💰 ${echapperHTML(t.prix)} FCFA

                </p>

                <button
                    class="btn-order"
                    onclick="selectionnerTerrain(${index})">

                    Commander ce terrain

                </button>

            </div>

        `;

    });

}


// ============================================
// SÉLECTIONNER UN TERRAIN
// ============================================

function selectionnerTerrain(index) {

    if (!terrains[index]) return;


    terrainSelectionne =
        terrains[index];


    const details =
        document.getElementById(
            "cart-details"
        );


    if (details) {

        details.innerHTML = `

            <strong>Terrain sélectionné</strong>

            <br>

            Terrain disponible à
            ${echapperHTML(
                terrainSelectionne.localisation
            )}

            <br>

            Superficie :
            ${echapperHTML(
                terrainSelectionne.superficie
            )}

            <br>

            Prix :
            ${echapperHTML(
                terrainSelectionne.prix
            )}
            FCFA

        `;

    }


    const popup =
        document.getElementById(
            "popup-commande"
        );


    if (popup) {

        popup.style.display = "block";

    }

}


// ============================================
// OUVRIR LE PANIER
// ============================================

function ouvrirPanier() {

    if (!terrainSelectionne) {

        alert(
            "Veuillez d'abord sélectionner un terrain."
        );

        return;

    }


    const popup =
        document.getElementById(
            "popup-commande"
        );


    if (popup) {

        popup.style.display = "block";

    }

}


// ============================================
// FERMER LE PANIER
// ============================================

function fermerPanier() {

    const popup =
        document.getElementById(
            "popup-commande"
        );


    if (popup) {

        popup.style.display = "none";

    }

}


// ============================================
// ENVOYER UNE COMMANDE
// ============================================

function validerEtEnvoyerCommande() {

    if (!terrainSelectionne) {

        alert(
            "Veuillez sélectionner un terrain."
        );

        return;

    }


    const nom =
        document.getElementById(
            "client-name"
        ).value.trim();


    const telephone =
        document.getElementById(
            "client-phone"
        ).value.trim();


    const whatsapp =
        document.getElementById(
            "client-whatsapp"
        ).value.trim();


    const fixe =
        document.getElementById(
            "client-fixe"
        ).value.trim();


    const autre =
        document.getElementById(
            "client-autre"
        ).value.trim();


    if (!nom || !telephone || !whatsapp) {

        alert(
            "Veuillez remplir votre nom, votre numéro d'appel et votre WhatsApp."
        );

        return;

    }


    const commande = {

        nom: nom,

        telephone: telephone,

        whatsapp: whatsapp,

        fixe: fixe,

        autre: autre,

        terrain:
            terrainSelectionne.id,

        localisation:
            terrainSelectionne.localisation,

        superficie:
            terrainSelectionne.superficie,

        prix:
            terrainSelectionne.prix,

        date:
            new Date().toLocaleString("fr-FR")

    };


    // IMPORTANT :
    // Les commandes sont maintenant également
    // enregistrées dans Firebase.

    database
        .ref("r2b_commandes")
        .push(commande)

        .then(function() {

            alert(
                "Votre commande a été envoyée avec succès !"
            );


            document.getElementById(
                "client-name"
            ).value = "";

            document.getElementById(
                "client-phone"
            ).value = "";

            document.getElementById(
                "client-whatsapp"
            ).value = "";

            document.getElementById(
                "client-fixe"
            ).value = "";

            document.getElementById(
                "client-autre"
            ).value = "";


            fermerPanier();

        })

        .catch(function(error) {

            console.error(error);

            alert(
                "Erreur lors de l'envoi de la commande."
            );

        });

}


// ============================================
// PROTECTION DU TEXTE AFFICHÉ
// ============================================

function echapperHTML(texte) {

    const div =
        document.createElement("div");

    div.textContent =
        String(texte);

    return div.innerHTML;

        }
