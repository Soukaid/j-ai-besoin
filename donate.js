// Variables globales pour le formulaire de don
let selectedPhotos = [];
let donationMap = null;
let selectedLocation = null;

// Initialisation de la page de don
document.addEventListener('DOMContentLoaded', function() {
    setupPhotoUpload();
    setupLocationMap();
    setupFormEvents();
});

// Configuration de l'upload de photos
function setupPhotoUpload() {
    const photoInput = document.getElementById('item-photos');
    const uploadArea = document.getElementById('photo-upload-area');
    const preview = document.getElementById('photo-preview');
    
    // Événements de drag & drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Événement de sélection de fichiers
    photoInput.addEventListener('change', handleFileSelect);
    
    // Clic sur la zone d'upload
    uploadArea.addEventListener('click', () => photoInput.click());
}

// Gestion du drag over
function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
}

// Gestion du drag leave
function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
}

// Gestion du drop
function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
}

// Gestion de la sélection de fichiers
function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    processFiles(files);
}

// Traitement des fichiers
function processFiles(files) {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (selectedPhotos.length + imageFiles.length > 5) {
        showError('Vous ne pouvez ajouter que 5 photos maximum');
        return;
    }
    
    imageFiles.forEach(file => {
        if (file.size > 5 * 1024 * 1024) { // 5MB max
            showError(`Le fichier ${file.name} est trop volumineux (max 5MB)`);
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const photo = {
                id: Date.now() + Math.random(),
                file: file,
                url: e.target.result,
                name: file.name
            };
            
            selectedPhotos.push(photo);
            updatePhotoPreview();
        };
        reader.readAsDataURL(file);
    });
}

// Mettre à jour l'aperçu des photos
function updatePhotoPreview() {
    const preview = document.getElementById('photo-preview');
    const uploadArea = document.getElementById('photo-upload-area');
    
    if (selectedPhotos.length === 0) {
        preview.innerHTML = '';
        uploadArea.style.display = 'block';
        return;
    }
    
    uploadArea.style.display = selectedPhotos.length >= 5 ? 'none' : 'block';
    
    preview.innerHTML = selectedPhotos.map(photo => `
        <div class="photo-item">
            <img src="${photo.url}" alt="${photo.name}">
            <button type="button" class="photo-remove" onclick="removePhoto('${photo.id}')">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

// Supprimer une photo
function removePhoto(photoId) {
    selectedPhotos = selectedPhotos.filter(photo => photo.id !== photoId);
    updatePhotoPreview();
}

// Configuration de la carte de localisation
function setupLocationMap() {
  const mapContainer = document.getElementById("location-map")
  const locationInput = document.getElementById("item-location")

  // Initialiser la carte - Casablanca par défaut
  donationMap = L.map("location-map").setView([33.5731, -7.5898], 10)

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(donationMap);

  let marker = null;

  // Événement de clic sur la carte
  donationMap.on("click", function(e) {
        const { lat, lng } = e.latlng;
        
        if (marker) {
            donationMap.removeLayer(marker);
        }
        
        marker = L.marker([lat, lng]).addTo(donationMap);
        selectedLocation = { lat, lng };
        
        // Géocodage inverse pour obtenir l'adresse
        reverseGeocode(lat, lng).then(address => {
            locationInput.value = address;
        });
    });
    
    // Géolocalisation automatique
    locationInput.addEventListener('blur', function() {
        const address = this.value;
        if (address) {
            geocodeAddress(address).then(coords => {
                if (coords) {
                    donationMap.setView([coords.lat, coords.lng], 15);
                    
                    if (marker) {
                        donationMap.removeLayer(marker);
                    }
                    
                    marker = L.marker([coords.lat, coords.lng]).addTo(donationMap);
                    selectedLocation = coords;
                }
            });
        }
    });
}

// Géocodage d'adresse - Villes marocaines
async function geocodeAddress(address) {
  // Coordonnées des principales villes marocaines
  const mockCoords = {
    casablanca: { lat: 33.5731, lng: -7.5898 },
    rabat: { lat: 34.0209, lng: -6.8416 },
    marrakech: { lat: 31.6295, lng: -7.9811 },
    fès: { lat: 34.0181, lng: -5.0078 },
    fez: { lat: 34.0181, lng: -5.0078 },
    tanger: { lat: 35.7595, lng: -5.834 },
    agadir: { lat: 30.4278, lng: -9.5981 },
    meknes: { lat: 33.8935, lng: -5.5473 },
    meknès: { lat: 33.8935, lng: -5.5473 },
    oujda: { lat: 34.6814, lng: -1.9086 },
    kenitra: { lat: 34.261, lng: -6.5802 },
    kénitra: { lat: 34.261, lng: -6.5802 },
    tetouan: { lat: 35.5889, lng: -5.3626 },
    tétouan: { lat: 35.5889, lng: -5.3626 },
    safi: { lat: 32.2994, lng: -9.2372 },
    mohammedia: { lat: 33.6866, lng: -7.3674 },
    khouribga: { lat: 32.8811, lng: -6.9063 },
    "beni mellal": { lat: 32.3373, lng: -6.3498 },
    "béni mellal": { lat: 32.3373, lng: -6.3498 },
    "el jadida": { lat: 33.2316, lng: -8.5007 },
    nador: { lat: 35.1681, lng: -2.9287 },
    settat: { lat: 33.0013, lng: -7.6216 },
    berrechid: { lat: 33.2651, lng: -7.5862 },
    khemisset: { lat: 33.8244, lng: -6.0661 },
    khmisset: { lat: 33.8244, lng: -6.0661 },
  }
    
    const city = address.toLowerCase().split(' ')[0];
    return mockCoords[city] || null;
}

// Géocodage inverse (simulation)
// Géocodage inverse - Villes marocaines
async function reverseGeocode(lat, lng) {
  // Principales villes marocaines avec leurs coordonnées
  const cities = [
    { name: "Casablanca", lat: 33.5731, lng: -7.5898 },
    { name: "Rabat", lat: 34.0209, lng: -6.8416 },
    { name: "Marrakech", lat: 31.6295, lng: -7.9811 },
    { name: "Fès", lat: 34.0181, lng: -5.0078 },
    { name: "Tanger", lat: 35.7595, lng: -5.834 },
    { name: "Agadir", lat: 30.4278, lng: -9.5981 },
    { name: "Meknès", lat: 33.8935, lng: -5.5473 },
    { name: "Oujda", lat: 34.6814, lng: -1.9086 },
    { name: "Kénitra", lat: 34.261, lng: -6.5802 },
    { name: "Tétouan", lat: 35.5889, lng: -5.3626 },
    { name: "Safi", lat: 32.2994, lng: -9.2372 },
    { name: "Mohammedia", lat: 33.6866, lng: -7.3674 },
    { name: "Khouribga", lat: 32.8811, lng: -6.9063 },
    { name: "Béni Mellal", lat: 32.3373, lng: -6.3498 },
    { name: "El Jadida", lat: 33.2316, lng: -8.5007 },
    { name: "Nador", lat: 35.1681, lng: -2.9287 },
    { name: "Settat", lat: 33.0013, lng: -7.6216 },
  ];

    // Trouver la ville la plus proche
    let closest = cities[0];
    let minDistance = calculateDistance(lat, lng, closest.lat, closest.lng);
    
    cities.forEach(city => {
        const distance = calculateDistance(lat, lng, city.lat, city.lng);
        if (distance < minDistance) {
            minDistance = distance;
            closest = city;
        }
    });
    
    return closest.name;
}

// Configuration des événements du formulaire
function setupFormEvents() {
    const form = document.getElementById('donate-form');
    const previewBtn = document.getElementById('preview-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    previewBtn.addEventListener('click', showPreview);
    form.addEventListener('submit', handleFormSubmit);
    
    // Validation en temps réel
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        field.addEventListener('blur', validateField);
        field.addEventListener('input', clearFieldError);
    });
}

// Validation d'un champ
function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Supprimer les erreurs précédentes
    clearFieldError(e);
    
    if (!value) {
        showFieldError(field, 'Ce champ est obligatoire');
        return false;
    }
    
    // Validations spécifiques
    if (field.type === 'email' && !validateEmail(value)) {
        showFieldError(field, 'Veuillez saisir un email valide');
        return false;
    }
    
    return true;
}

// Afficher une erreur sur un champ
function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

// Supprimer l'erreur d'un champ
function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Afficher l'aperçu
function showPreview() {
    const formData = getFormData();
    
    if (!validateForm(formData)) {
        return;
    }
    
    const modal = document.getElementById('preview-modal');
    const previewContent = document.getElementById('preview-content');
    
    previewContent.innerHTML = createPreviewHTML(formData);
    modal.classList.add('active');
    
    // Événements de la modal
    document.getElementById('close-preview').onclick = () => modal.classList.remove('active');
    document.getElementById('edit-btn').onclick = () => modal.classList.remove('active');
    document.getElementById('confirm-publish').onclick = () => publishDonation(formData);
}

// Récupérer les données du formulaire
function getFormData() {
    const form = document.getElementById('donate-form');
    const formData = new FormData(form);
    
    return {
        title: formData.get('title'),
        category: formData.get('category'),
        condition: formData.get('condition'),
        description: formData.get('description'),
        location: formData.get('location'),
        contact: formData.get('contact'),
        availability: formData.get('availability'),
        photos: selectedPhotos,
        coordinates: selectedLocation
    };
}

// Valider le formulaire
function validateForm(data) {
    let isValid = true;
    
    if (!data.title) {
        showError('Le titre est obligatoire');
        isValid = false;
    }
    
    if (!data.category) {
        showError('La catégorie est obligatoire');
        isValid = false;
    }
    
    if (!data.description) {
        showError('La description est obligatoire');
        isValid = false;
    }
    
    if (!data.location) {
        showError('La localisation est obligatoire');
        isValid = false;
    }
    
    if (selectedPhotos.length === 0) {
        showError('Veuillez ajouter au moins une photo');
        isValid = false;
    }
    
    return isValid;
}

// Créer le HTML de l'aperçu
function createPreviewHTML(data) {
    const photosHTML = data.photos.map(photo => 
        `<img src="${photo.url}" alt="${photo.name}">`
    ).join('');
    
    return `
        <div class="preview-card">
            <div class="preview-images">
                ${photosHTML}
            </div>
            <div style="padding: 1.5rem;">
                <h3 style="margin-bottom: 1rem;">${data.title}</h3>
                <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <span class="result-category">${getCategoryName(data.category)}</span>
                    <span style="color: var(--text-secondary);">État: ${data.condition}</span>
                </div>
                <p style="margin-bottom: 1rem;">${data.description}</p>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                    <i class="fas fa-map-marker-alt" style="color: var(--primary-color);"></i>
                    <span>${data.location}</span>
                </div>
                ${data.availability ? `<p><strong>Disponibilité:</strong> ${data.availability}</p>` : ''}
                ${data.contact ? `<p><strong>Contact:</strong> ${data.contact}</p>` : ''}
            </div>
        </div>
    `;
}

// Publier le don
function publishDonation(data) {
    // Simulation de la publication
    const modal = document.getElementById('preview-modal');
    
    // Ajouter le don aux données locales
    const newDonation = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
        distance: '0 km',
        image: data.photos[0]?.url || '/placeholder.svg?height=200&width=300',
        condition: data.condition,
        date: new Date().toISOString().split('T')[0],
        contact: data.contact,
        availability: data.availability,
        photos: data.photos.map(p => p.url),
        coordinates: data.coordinates
    };
    
    // Sauvegarder localement
    let userDonations = getFromLocalStorage('userDonations') || [];
    userDonations.push(newDonation);
    saveToLocalStorage('userDonations', userDonations);
    
    // Afficher le succès
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Don publié avec succès !</h3>
            </div>
            <div class="modal-body">
                <div class="message message-success">
                    <i class="fas fa-check-circle"></i>
                    Votre don "${data.title}" a été publié et est maintenant visible par la communauté.
                </div>
                <p>Les personnes intéressées pourront vous contacter directement.</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="window.location.href='index.html'">Retour à l'accueil</button>
                <button class="btn btn-primary" onclick="window.location.href='profile.html'">Voir mes dons</button>
            </div>
        </div>
    `;
}

// Gestion de la soumission du formulaire
function handleFormSubmit(e) {
    e.preventDefault();
    showPreview();
}

// Styles CSS additionnels pour les erreurs
const additionalStyles = `
    .form-input.error,
    .form-textarea.error,
    .form-select.error {
        border-color: var(--error-color);
    }
    
    .field-error {
        color: var(--error-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
`;

// Ajouter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);