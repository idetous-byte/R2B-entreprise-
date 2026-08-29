// ======================================================
// R2B ENTREPRISE - SCRIPT CLIENT
// ======================================================

// ======================================================
// 1. ÉCRAN DE DÉMARRAGE
// ======================================================

// Le démarrage est volontairement indépendant de Firebase.
// Même si Firebase rencontre un problème,
// l'écran R2B disparaîtra après 3 secondes.

window.addEventListener("DOMContentLoaded", function () {

setTimeout(function () {

    const splash =
        document.getElementById("splash-screen");


    if (splash) {

        splash.style.opacity = "0";


        setTimeout(function () {

            splash.style.visibility = "hidden";

            splash.style.pointerEvents = "none";

            splash.style.display = "none";

        }, 500);

    }

}, 3000);

});

// ======================================================
// 2. CONFIGURATION FIREBASE
// ======================================================

const firebaseConfig = {

apiKey: "À_REMPLACER_PAR_TA_VRAIE_API_KEY",

authDomain:
    "r2b-entreprise.firebaseapp.com",

databaseURL:
    "À_REMPLACER_PAR_TA_VRAIE_DATABASE_URL",

projectId:
    "r2b-entreprise",

storageBucket:
    "r2b-entreprise.appspot.com",

messagingSenderId:
    "614614560237",

appId:
    "1:614614560237:web:6ca754bde319f587590be4"

};

// ======================================================
// 3. VARIABLES
// ======================================================

let database = null;

let terrainSelectionne = null;

let terrainsDisponibles = [];

// ======================================================
// 4. INITIALISATION FIREBASE
// ======================================================

if (typeof firebase !== "undefined") {

try {

    firebase.initializeApp(firebaseConfig);

    database = firebase.database();

    console.log("Firebase connecté.");

    chargerDonneesFirebase();

}

catch (error) {

    console.error(
        "Erreur Firebase :",
        error
    );

    afficherErreurFirebase();

}

}

else {

console.error(
    "Firebase n'est pas chargé."
);

afficherErreurFirebase();

}

// ======================================================
// 5. CHARGER LES TERRAINS
// ======================================================

function chargerDonneesFirebase() {

if (!database) {

    afficherErreurFirebase();

    return;

}


database.ref("r2b_terrains").on(

    "value",

    function (snapshot) {

        const liste = [];


        snapshot.forEach(
            function (childSnapshot) {

                const terrain =
                    childSnapshot.val();


                if (terrain) {

                    liste.push(terrain);

                }

            }
        );


        terrainsDisponibles = liste;


        chargerTerrainsClient(liste);

    },


    function (error) {

        console.error(
            "Erreur Firebase :",
            error
        );


        afficherErreurFirebase();

    }

);

}

// ======================================================
// 6. ERREUR FIREBASE
// ======================================================

function afficherErreurFirebase() {

const container =
    document.getElementById(
        "terrains-container"
    );


if (!container) return;


container.innerHTML = `

    <p style="
        text-align:center;
        grid-column:1/-1;
        color:red;
        padding:20px;
    ">

        Impossible de charger les terrains.

        <br>

        Vérifiez la connexion Firebase.

    </p>

`;

}

// ======================================================
// 7. AFFICHAGE DES TERRAINS
// ======================================================

function chargerTerrainsClient(liste) {

const container =
    document.getElementById(
        "terrains-container"
    );


if (!container) return;


// Aucun terrain disponible

if (!liste || liste.length === 0) {

    container.innerHTML = `

        <p style="
            text-align:center;
            grid-column:1/-1;
            padding:20px;
        ">

            Terrain indisponible.

        </p>

    `;

    return;

}


container.innerHTML = "";


liste.forEach(
    function (t, i) {

        const superficie =
            t.superficie ||
            "Non précisée";


        const localisation =
            t.localisation ||
            "Non précisée";


        const prix =
            t.prix ||
            "Prix non précisé";


        const card =
            document.createElement("div");


        card.className =
            "card-terrain";


        card.innerHTML = `

            <h2>
                Terrain ${i + 1}
            </h2>


            <div class="info-line">

                <strong>
                    Superficie :
                </strong>

                ${superficie}

            </div>


            <div class="info-line">

                <strong>
                    Localisation :
                </strong>

                ${localisation}

            </div>


            <div class="price-line">

                ${prix} FCFA

            </div>


            <button class="btn-order">

                Commander

            </button>

        `;


        const bouton =
            card.querySelector(
                ".btn-order"
            );


        bouton.addEventListener(
            "click",
            function () {

                ajouterAuPanier(
                    i,
                    localisation,
                    prix
                );

            }
        );


        container.appendChild(card);

    }
);

}

// ======================================================
// 8. AJOUTER AU PANIER
// ======================================================

function ajouterAuPanier(
index,
localisation,
prix
) {

terrainSelectionne = {

    index: index,

    localisation: localisation,

    prix: prix

};


const details =
    document.getElementById(
        "cart-details"
    );


if (details) {

    details.innerHTML = `

        <strong>
            Terrain sélectionné
        </strong>

        <br>

        📍 ${localisation}

        <br>

        💰 ${prix} FCFA

    `;

}


ouvrirPanier();

}

// ======================================================
// 9. OUVRIR LE PANIER
// ======================================================

function ouvrirPanier() {

const popup =
    document.getElementById(
        "popup-commande"
    );


if (!popup) return;


popup.style.display = "block";

}

// ======================================================
// 10. FERMER LE PANIER
// ======================================================

function fermerPanier() {

const popup =
    document.getElementById(
        "popup-commande"
    );


if (!popup) return;


popup.style.display = "none";

}

// ======================================================
// 11. ENVOYER LA COMMANDE
// ======================================================

function validerEtEnvoyerCommande() {

if (!terrainSelectionne) {

    alert(
        "Veuillez sélectionner un terrain."
    );

    return;

}


if (!database) {

    alert(
        "La connexion Firebase n'est pas disponible."
    );

    return;

}


const nom =
    document
        .getElementById("client-name")
        ?.value
        .trim();


const telephone =
    document
        .getElementById("client-phone")
        ?.value
        .trim();


const whatsapp =
    document
        .getElementById("client-whatsapp")
        ?.value
        .trim();


const fixe =
    document
        .getElementById("client-fixe")
        ?.value
        .trim();


const autre =
    document
        .getElementById("client-autre")
        ?.value
        .trim();


if (!nom) {

    alert(
        "Veuillez entrer votre nom et prénom."
    );

    return;

}


if (
    !telephone &&
    !whatsapp &&
    !fixe &&
    !autre
) {

    alert(
        "Veuillez indiquer au moins un moyen de contact."
    );

    return;

}


const commande = {

    nom: nom,

    telephone: telephone,

    whatsapp: whatsapp,

    fixe: fixe,

    autre: autre,


    terrain: {

        localisation:
            terrainSelectionne.localisation,

        prix:
            terrainSelectionne.prix

    },


    date:
        new Date().toISOString(),


    statut:
        "Nouvelle commande"

};


database
    .ref("r2b_commandes")
    .push(commande)


    .then(function () {

        alert(
            "Votre commande a bien été envoyée."
        );


        const champs = [

            "client-name",

            "client-phone",

            "client-whatsapp",

            "client-fixe",

            "client-autre"

        ];


        champs.forEach(
            function (id) {

                const champ =
                    document.getElementById(id);


                if (champ) {

                    champ.value = "";

                }

            }
        );


        fermerPanier();

    })


    .catch(function (error) {

        console.error(
            "Erreur lors de l'envoi :",
            error
        );


        alert(
            "Impossible d'envoyer la commande. Vérifiez Firebase."
        );

    });

    }
