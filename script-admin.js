window.addEventListener('DOMContentLoaded', () => {
    chargerCommandesChef();
});

function chargerCommandesChef() {
    const container = document.getElementById('commandes-container'); // Vérifiez que cet ID existe dans admin.html
    if (!container) return;

    // Récupérer les commandes enregistrées par le client
    const commandes = JSON.parse(localStorage.getItem('r2b_commandes') || '[]');

    if (commandes.length === 0) {
        container.innerHTML = "<p style='text-align:center;'>Aucune commande reçue pour le moment.</p>";
        return;
    }

    container.innerHTML = "";
    
    // Afficher chaque commande sous forme de carte ou de ligne
    commandes.forEach((c, i) => {
        container.innerHTML += `
            <div class="card-commande" style="border: 1px solid #ccc; padding: 15px; margin-bottom: 10px; background: white; border-radius: 8px;">
                <h3>Commande #${i + 1} - ${c.date}</h3>
                <p><strong>Client :</strong> ${c.nom}</p>
                <p><strong>Téléphone :</strong> ${c.telephone} / <strong>WhatsApp :</strong> ${c.whatsapp}</p>
                <p><strong>Terrain :</strong> Terrain ${c.terrain} à ${c.localisation}</p>
                <p><strong>Prix :</strong> ${c.prix} FCFA</p>
                <button onclick="supprimerCommande(${i})" style="background: red; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Supprimer</button>
            </div>
        `;
    });
}

// Fonction pour permettre au chef de nettoyer sa liste
function supprimerCommande(index) {
    const commandes = JSON.parse(localStorage.getItem('r2b_commandes') || '[]');
    commandes.splice(index, 1); // Retire la commande de la liste
    localStorage.setItem('r2b_commandes', JSON.stringify(commandes));
    chargerCommandesChef(); // Recommence l'affichage
}
