// Variables globales pour la recherche
let allDonations = [];
let filteredDonations = [];
let currentView = 'grid';

// Initialisation de la page de recherche
document.addEventListener('DOMContentLoaded', function() {
    // Charger les données
    loadDonations();
    
    // Gérer les paramètres URL
    handleURLParams();
    
    // Événements de recherche
    setupSearchEvents();
    
    // Événements de vue
    setupViewEvents();
});

// Charger toutes les donations
function loadDonations() {
    // Utiliser les données simulées + quelques donations supplémentaires
    allDonations = [
        ...sampleDonations,
        {
            id: 7,
            title: "Table basse en bois massif",
            description: "Belle table basse en chêne massif, quelques petites rayures mais très solide.",
            category: "meubles",
            location: "casablanca ain chock",
            distance: "1.2 km",
            image: "images/table.jpg",
            condition: "bon",
            date: "2024-01-09"
        },
        {
            id: 8,
            title: "Robe de soirée taille 38",
            description: "Magnifique robe de soirée noire, portée une seule fois. Parfaite pour un événement.",
            category: "vetements",
            location: "fes",
            distance: "3.4 km",
            image: "images/robe.jpg",
            condition: "excellent",
            date: "2024-01-08"
        },
        {
            id: 9,
            title: "Console de jeux PlayStation 4",
            description: "PlayStation 4 en bon état avec 2 manettes et quelques jeux. Fonctionne parfaitement.",
            category: "electronique",
            location: "tanger",
            distance: "6.8 km",
            image: "images/playstation.jpg",
            condition: "bon",
            date: "2024-01-07"
        },
        {
            id: 10,
            title: "Encyclopédie Universalis",
            description: "Collection complète de l'Encyclopédie Universalis, 30 volumes. Parfait état.",
            category: "livres",
            location: "kenitra",
            distance: "2.7 km",
            image: "images/encyclo.jpg",
            condition: "excellent",
            date: "2024-01-06"
        }
    ];
    
    filteredDonations = [...allDonations];
    displayResults();
}

// Gérer les paramètres URL
function handleURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const query = urlParams.get('q');
    const location = urlParams.get('location');
    
    if (category) {
        document.getElementById('category-filter').value = category;
    }
    if (query) {
        document.getElementById('search-query').value = query;
    }
    if (location) {
        document.getElementById('location-filter').value = location;
    }
    
    if (category || query || location) {
        performSearch();
    }
}

// Configuration des événements de recherche
function setupSearchEvents() {
    const searchBtn = document.getElementById('search-btn');
    const searchQuery = document.getElementById('search-query');
    const categoryFilter = document.getElementById('category-filter');
    const locationFilter = document.getElementById('location-filter');
    
    searchBtn.addEventListener('click', performSearch);
    
    // Recherche en temps réel
    searchQuery.addEventListener('input', debounce(performSearch, 300));
    categoryFilter.addEventListener('change', performSearch);
    locationFilter.addEventListener('input', debounce(performSearch, 300));
    
    // Recherche avec Entrée
    searchQuery.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

// Configuration des événements de vue
function setupViewEvents() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    
    gridViewBtn.addEventListener('click', () => switchView('grid'));
    listViewBtn.addEventListener('click', () => switchView('list'));
}

// Effectuer la recherche
function performSearch() {
    const query = document.getElementById('search-query').value.toLowerCase();
    const category = document.getElementById('category-filter').value;
    const location = document.getElementById('location-filter').value.toLowerCase();
    
    filteredDonations = allDonations.filter(donation => {
        const matchesQuery = !query || 
            donation.title.toLowerCase().includes(query) ||
            donation.description.toLowerCase().includes(query);
        
        const matchesCategory = !category || donation.category === category;
        
        const matchesLocation = !location || 
            donation.location.toLowerCase().includes(location);
        
        return matchesQuery && matchesCategory && matchesLocation;
    });
    
    displayResults();
}

// Afficher les résultats
function displayResults() {
    const container = document.getElementById('results-container');
    const countElement = document.getElementById('results-count');
    const noResults = document.getElementById('no-results');
    
    // Mettre à jour le compteur
    const count = filteredDonations.length;
    countElement.textContent = `${count} résultat${count > 1 ? 's' : ''} trouvé${count > 1 ? 's' : ''}`;
    
    if (count === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    container.style.display = currentView === 'grid' ? 'grid' : 'flex';
    noResults.style.display = 'none';
    
    container.innerHTML = filteredDonations.map(donation => 
        currentView === 'grid' ? createGridCard(donation) : createListCard(donation)
    ).join('');
}

// Créer une carte en mode grille
function createGridCard(donation) {
    return `
        <div class="result-card" onclick="showDonationDetails(${donation.id})">
            <img src="${donation.image}" alt="${donation.title}" class="result-image">
            <div class="result-content">
                <h3 class="result-title">${donation.title}</h3>
                <p class="result-description">${donation.description}</p>
                <div class="result-meta">
                    <div class="result-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${donation.location}</span>
                    </div>
                    <span class="result-distance">${donation.distance}</span>
                </div>
                <div class="result-category">${getCategoryName(donation.category)}</div>
                <div class="result-actions">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showInterestModal(${donation.id})">
                        <i class="fas fa-heart"></i>
                        Je suis intéressé(e)
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Créer une carte en mode liste
function createListCard(donation) {
    return `
        <div class="result-card list-card" onclick="showDonationDetails(${donation.id})" style="display: flex; align-items: center; gap: 1.5rem;">
            <img src="${donation.image}" alt="${donation.title}" style="width: 150px; height: 100px; object-fit: cover; border-radius: var(--radius-md); flex-shrink: 0;">
            <div style="flex: 1;">
                <h3 class="result-title">${donation.title}</h3>
                <p class="result-description" style="-webkit-line-clamp: 1;">${donation.description}</p>
                <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                    <div class="result-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${donation.location}</span>
                    </div>
                    <span class="result-distance">${donation.distance}</span>
                    <span class="result-category">${getCategoryName(donation.category)}</span>
                </div>
            </div>
            <div class="result-actions">
                <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); showInterestModal(${donation.id})">
                    <i class="fas fa-heart"></i>
                    Je suis intéressé(e)
                </button>
            </div>
        </div>
    `;
}

// Changer de vue
function switchView(view) {
    currentView = view;
    
    const gridBtn = document.getElementById('grid-view');
    const listBtn = document.getElementById('list-view');
    const container = document.getElementById('results-container');
    
    if (view === 'grid') {
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
        container.className = 'results-grid';
    } else {
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
        container.className = 'results-list';
    }
    
    displayResults();
}

// Fonction utilitaire pour debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}