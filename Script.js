let terrainSelectionne = null;

// 1. GESTION DU SPLASH SCREEN (3 SECONDES)
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) {
            splash.style.opacity = '0';
            setTimeout(() => { splash.style.visibility = 'hidden'; }, 500);
        }
    }, 3000);
    chargerTerrainsClient();
});

// 2. AFFICHAGE DES TERRAINS EN GRILLE
function chargerTerrainsClient() {
    const container = document.getElementById('terrains-container');
    if (!container) return;
    const liste = JSON.parse(localStorage.getItem('r2b_terrains') || '[]');
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
            </div>
        `;
    });
}

// 3. ACTION QUAND ON CLIQUE SUR COMMANDER
function ajouterAuPanier(index, loc, prix) {
    terrainSelectionne = { index: index + 1, localisation: loc, prix: prix };
    document.getElementById('cart-count').innerText = "1";
    ouvrirPanier();
}

function ouvrirPanier() {
    if (!terrainSelectionne) { alert("Choisissez d'abord un terrain !"); return; }
    document.getElementById('cart-details').innerHTML = `<strong>Terrain ${terrainSelectionne.index}</strong> à ${terrainSelectionne.localisation} (${terrainSelectionne.prix} FCFA)`;
    
    const f = document.getElementById('popup-commande');
    f.style.transform = "translate3d(0px, 0px, 0px)";
    f.style.display = 'block';
}

function fermerPanier() { 
    document.getElementById('popup-commande').style.display = 'none'; 
}

// 4. ENVOI DE LA COMMANDE ET REDIRECTION
function validerEtEnvoyerCommande() {
    const nomComplet = document.getElementById('client-name').value;
    const tel = document.getElementById('client-phone').value;
    const wa = document.getElementById('client-whatsapp').value;
    const fixe = document.getElementById('client-fixe').value;
    const autre = document.getElementById('client-autre').value;

    if(!nomComplet || !tel || !wa) { alert("Veuillez remplir au moins le Nom, l'Appel direct et le WhatsApp !"); return; }

    const nouvelleCommande = {
        nom: nomComplet, telephone: tel, whatsapp: wa, fixe: fixe, autre: autre,
        terrain: terrainSelectionne.index, localisation: terrainSelectionne.localisation, prix: terrainSelectionne.prix,
        date: new Date().toLocaleDateString('fr-FR')
    };

    const commandes = JSON.parse(localStorage.getItem('r2b_commandes') || '[]');
    commandes.push(nouvelleCommande);
    localStorage.setItem('r2b_commandes', JSON.stringify(commandes));

    const msg = encodeURIComponent(`Bonjour R2B Entreprise, je m'appelle ${nomComplet}.\nTel : ${tel}\nWhatsApp : ${wa}\nFixe : ${fixe}\nAutre contact : ${autre}\nJe souhaite commander le terrain de ${terrainSelectionne.localisation} (Terrain ${terrainSelectionne.index}) affiché à ${terrainSelectionne.prix} FCFA. Rendez-vous pour la visite.`);
    
    // CORRECTION ICI : Ajout du slash et des backticks pour WhatsApp
    window.open(`https://wa.me{msg}`, '_blank');

    alert("Commande transmise à R2B Entreprise !");
    terrainSelectionne = null;
    document.getElementById('cart-count').innerText = "0";
    fermerPanier();
}

