// Navigation mobile
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Fermer le menu mobile quand on clique sur un lien
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Gestion des catégories sur la page d'accueil
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            if (category) {
                window.location.href = `search.html?category=${category}`;
            }
        });
    });

    // Charger les dons récents sur la page d'accueil
    loadRecentDonations();
});

// Données simulées pour les dons
const sampleDonations = [
    {
        id: 1,
        title: "Canapé 3 places en cuir",
        description: "Canapé en cuir marron, quelques traces d'usure mais très confortable. Parfait pour un salon.",
        category: "meubles",
        location: "Rabat Agdal",
        distance: "2.3 km",
        image: "images/canapé.jpg",
        condition: "bon",
        date: "2024-01-15"
    },
    {
        id: 2,
        title: "Lot de vêtements enfant 3-4 ans",
        description: "Vêtements de saison automne/hiver pour enfant de 3-4 ans. Très bon état, peu portés.",
        category: "vetements",
        location: "Casablanca Maarif",
        distance: "1.8 km",
        image: "images/lot vetements.jpg",
        condition: "excellent",
        date: "2024-01-14"
    },
    {
        id: 3,
        title: "Ordinateur portable HP",
        description: "Ordinateur portable HP, 15 pouces, fonctionne bien mais un peu lent. Idéal pour bureautique.",
        category: "electronique",
        location: "kenitra Centre",
        distance: "5.1 km",
        image: "images/laptop.jpg",
        condition: "correct",
        date: "2024-01-13"
    },
    {
        id: 4,
        title: "Collection de livres de cuisine",
        description: "Une vingtaine de livres de cuisine française et internationale. Parfait pour les passionnés.",
        category: "livres",
        location: "Casablanca Anfa",
        distance: "3.7 km",
        image: "images/livres.jpg",
        condition: "bon",
        date: "2024-01-12"
    },
    {
        id: 5,
        title: "Machine à café Nespresso",
        description: "Machine à café Nespresso rouge, fonctionne parfaitement. Avec quelques capsules offertes.",
        category: "electromenager",
        location: "Casablanca Ain Diab",
        distance: "4.2 km",
        image: "images/Machine à café Nespresso.jpg",
        condition: "excellent",
        date: "2024-01-11"
    },
    {
        id: 6,
        title: "Vélo enfant 6-8 ans",
        description: "Vélo bleu pour enfant de 6-8 ans, avec petites roues amovibles. Quelques rayures mais fonctionne bien.",
        category: "jouets",
        location: "Rabat Hay Riad",
        distance: "2.9 km",
        image: "images/velo.jpg",
        condition: "bon",
        date: "2024-01-10"
    }
];

// Charger les dons récents
function loadRecentDonations() {
    const container = document.getElementById('recent-donations');
    if (!container) return;

    const recentDonations = sampleDonations.slice(0, 4);
    
    container.innerHTML = recentDonations.map(donation => `
        <div class="donation-card" onclick="showDonationDetails(${donation.id})">
            <img src="${donation.image}" alt="${donation.title}" class="donation-image">
            <div class="donation-content">
                <h3 class="donation-title">${donation.title}</h3>
                <p class="donation-description">${donation.description}</p>
                <div class="donation-meta">
                    <div class="donation-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${donation.location}</span>
                    </div>
                    <span class="donation-category">${getCategoryName(donation.category)}</span>
                </div>
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showInterestModal(${donation.id})">
                    <i class="fas fa-heart"></i>
                    Je suis intéressé(e)
                </button>
            </div>
        </div>
    `).join('');
}

// Obtenir le nom de la catégorie
function getCategoryName(category) {
    const categories = {
        'vetements': 'Vêtements',
        'meubles': 'Meubles',
        'electronique': 'Électronique',
        'livres': 'Livres',
        'electromenager': 'Électroménager',
        'jouets': 'Jouets',
        'decoration': 'Décoration',
        'sport': 'Sport',
        'jardin': 'Jardin',
        'autre': 'Autre'
    };
    return categories[category] || category;
}

// Afficher les détails d'un don
function showDonationDetails(donationId) {
    const donation = sampleDonations.find(d => d.id === donationId);
    if (!donation) return;

    // Créer une modal pour afficher les détails
    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${donation.title}</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${donation.image}" alt="${donation.title}" style="width: 100%; height: 250px; object-fit: cover; border-radius: var(--radius-md); margin-bottom: 1rem;">
                <div class="donation-meta" style="margin-bottom: 1rem;">
                    <div class="donation-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${donation.location} • ${donation.distance}</span>
                    </div>
                    <span class="donation-category">${getCategoryName(donation.category)}</span>
                </div>
                <p style="margin-bottom: 1rem;"><strong>État :</strong> ${donation.condition}</p>
                <p style="margin-bottom: 1rem;"><strong>Description :</strong></p>
                <p style="margin-bottom: 1.5rem;">${donation.description}</p>
                <p style="color: var(--text-secondary); font-size: 0.875rem;">Publié le ${new Date(donation.date).toLocaleDateString('fr-FR')}</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Fermer</button>
                <button class="btn btn-primary" onclick="showInterestModal(${donation.id})">
                    <i class="fas fa-heart"></i>
                    Je suis intéressé(e)
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Afficher la modal d'intérêt
function showInterestModal(donationId) {
    const donation = sampleDonations.find(d => d.id === donationId);
    if (!donation) return;

    // Fermer toute modal existante
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = 'modal active';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Contacter le donneur</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <p><strong>Objet :</strong> ${donation.title}</p>
                <p><strong>Localisation :</strong> ${donation.location}</p>
                <form id="interest-form">
                    <div class="form-group">
                        <label class="form-label">Votre message</label>
                        <textarea class="form-textarea" placeholder="Bonjour, je suis intéressé(e) par votre ${donation.title}. Quand puis-je venir le récupérer ?"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Votre email</label>
                        <input type="email" class="form-input" placeholder="votre@email.com" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Votre téléphone (optionnel)</label>
                        <input type="tel" class="form-input" placeholder="06 12 34 56 78">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Annuler</button>
                <button class="btn btn-primary" onclick="sendInterestMessage(${donationId})">
                    <i class="fas fa-paper-plane"></i>
                    Envoyer le message
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Envoyer un message d'intérêt
function sendInterestMessage(donationId) {
    // Simulation de l'envoi du message
    const modal = document.querySelector('.modal');
    const form = document.getElementById('interest-form');
    const email = form.querySelector('input[type="email"]').value;
    
    if (!email) {
        alert('Veuillez saisir votre email');
        return;
    }

    // Afficher un message de confirmation
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Message envoyé !</h3>
                <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="message message-success">
                    <i class="fas fa-check-circle"></i>
                    Votre message a été envoyé au donneur. Il vous contactera directement par email.
                </div>
                <p>En attendant, vous pouvez continuer à parcourir les autres dons disponibles.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-primary" onclick="this.closest('.modal').remove()">Parfait !</button>
            </div>
        </div>
    `;
}

// Gestion du localStorage pour sauvegarder les données
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Erreur lors de la sauvegarde:', e);
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Erreur lors de la récupération:', e);
        return null;
    }
}

// Utilitaires pour la géolocalisation
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('La géolocalisation n\'est pas supportée'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            },
            error => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    });
}

// Calculer la distance entre deux points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 10) / 10; // Arrondir à 1 décimale
}

// Formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Hier';
    } else if (diffDays < 7) {
        return `Il y a ${diffDays} jours`;
    } else {
        return date.toLocaleDateString('fr-FR');
    }
}

// Validation des formulaires
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return re.test(phone.replace(/\s/g, ''));
}

// Gestion des erreurs
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message message-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    
    // Insérer en haut de la page
    const main = document.querySelector('main') || document.body;
    main.insertBefore(errorDiv, main.firstChild);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'message message-success';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    
    // Insérer en haut de la page
    const main = document.querySelector('main') || document.body;
    main.insertBefore(successDiv, main.firstChild);
    
    // Supprimer après 5 secondes
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}