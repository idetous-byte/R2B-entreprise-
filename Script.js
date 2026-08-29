// ======================================================
// R2B ENTREPRISE - SCRIPT CLIENT
// ======================================================

// ===============================
// 1. CONFIGURATION FIREBASE
// ===============================

const firebaseConfig = {
    apiKey: "À_REMPLACER_PAR_TA_VRAIE_API_KEY",
    authDomain: "r2b-entreprise.firebaseapp.com",
    databaseURL: "À_REMPLACER_PAR_TA_VRAIE_DATABASE_URL",
    projectId: "r2b-entreprise",
    storageBucket: "r2b-entreprise.appspot.com",
    messagingSenderId: "614614560237",
    appId: "1:614614560237:web:6ca754bde319f587590be4"
};

// Vérifier que Firebase est chargé
if (typeof firebase !== "undefined") {

    firebase.initializeApp(firebaseConfig);

    const database = firebase.database();

    let terrainSelectionne = null;
    let terrainsDisponibles = [];


    // ======================================================
    // 2. ÉCRAN DE DÉMARRAGE
    // ======================================================

    window.addEventListener("DOMContentLoaded", () => {

        setTimeout(() => {

            const splash = document.getElementById("splash-screen");

            if (splash) {

                splash.style.opacity = "0";

                setTimeout(() => {
                    splash.style.visibility = "hidden";
                    splash.style.pointerEvents = "none";
                }, 500);

            }

        }, 3000);


        // ==================================================
        // 3. CHARGEMENT DES TERRAINS DEPUIS FIREBASE
        // ==================================================

        database.ref("r2b_terrains").on(
            "value",
            (snapshot) => {

                const liste = [];

                snapshot.forEach((childSnapshot) => {

                    const terrain = childSnapshot.val();

                    if (terrain) {
                        liste.push(terrain);
                    }

                });

                terrainsDisponibles = liste;

                chargerTerrainsClient(liste);
            },

            (error) => {

                console.error(
                    "Erreur Firebase :",
                    error
                );

                const container =
                    document.getElementById("terrains-container");

                if (container) {

                    container.innerHTML = `
                        <p style="
                            text-align:center;
                            grid-column:1/-1;
                            color:red;
                            padding:20px;
                        ">
                            Impossible de charger les terrains.
                            Vérifiez la connexion Firebase.
                        </p>
                    `;
                }

            }
        );

    });


    // ======================================================
    // 4. AFFICHAGE DES TERRAINS
    // ======================================================

    function chargerTerrainsClient(liste) {

        const container =
            document.getElementById("terrains-container");

        if (!container) return;


        if (!liste || liste.length === 0) {

            container.innerHTML = `
                <p style="
                    text-align:center;
                    grid-column:1/-1;
                ">
                    Aucun terrain disponible.
                </p>
            `;

            return;
        }


        container.innerHTML = "";


        liste.forEach((t, i) => {

            const superficie =
                t.superficie || "Non précisée";

            const localisation =
                t.localisation || "Non précisée";

            const prix =
                t.prix || "Prix non précisé";


            const card = document.createElement("div");

            card.className = "card-terrain";


            card.innerHTML = `
                <h2>Terrain ${i + 1}</h2>

                <div class="info-line">
                    <strong>Superficie :</strong>
                    ${superficie}
                </div>

                <div class="info-line">
                    <strong>Localisation :</strong>
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
                card.querySelector(".btn-order");


            bouton.addEventListener("click", () => {

                ajouterAuPanier(
                    i,
                    localisation,
                    prix
                );

            });


            container.appendChild(card);

        });

    }


    // ======================================================
    // 5. AJOUTER AU PANIER
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
            document.getElementById("cart-details");


        if (details) {

            details.innerHTML = `
                <strong>Terrain sélectionné</strong><br>
                📍 ${localisation}<br>
                💰 ${prix} FCFA
            `;

        }


        ouvrirPanier();

    }


    // ======================================================
    // 6. OUVRIR LE PANIER
    // ======================================================

    function ouvrirPanier() {

        const popup =
            document.getElementById("popup-commande");

        if (!popup) return;

        popup.style.display = "block";

    }


    // ======================================================
    // 7. FERMER LE PANIER
    // ======================================================

    function fermerPanier() {

        const popup =
            document.getElementById("popup-commande");

        if (!popup) return;

        popup.style.display = "none";

    }


    // ======================================================
    // 8. ENVOYER LA COMMANDE
    // ======================================================

    function validerEtEnvoyerCommande() {

        if (!terrainSelectionne) {

            alert("Veuillez sélectionner un terrain.");

            return;
        }


        const nom =
            document.getElementById("client-name").value.trim();

        const telephone =
            document.getElementById("client-phone").value.trim();

        const whatsapp =
            document.getElementById("client-whatsapp").value.trim();

        const fixe =
            document.getElementById("client-fixe").value.trim();

        const autre =
            document.getElementById("client-autre").value.trim();


        if (!nom) {

            alert("Veuillez entrer votre nom et prénom.");

            return;
        }


        if (!telephone && !whatsapp && !fixe && !autre) {

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

            statut: "Nouvelle commande"

        };


        // Enregistrer la commande dans Firebase
        database.ref("r2b_commandes").push(commande)

            .then(() => {

                alert(
                    "Votre commande a bien été envoyée."
                );


                document.getElementById("client-name").value = "";
                document.getElementById("client-phone").value = "";
                document.getElementById("client-whatsapp").value = "";
                document.getElementById("client-fixe").value = "";
                document.getElementById("client-autre").value = "";


                fermerPanier();

            })

            .catch((error) => {

                console.error(
                    "Erreur lors de l'envoi :",
                    error
                );

                alert(
                    "Impossible d'envoyer la commande. Vérifiez Firebase."
                );

            });

    }

} else {

    console.error(
        "Firebase n'est pas chargé."
    );

                }
