// Variables globales pour l'authentification
let isLoginMode = true
let currentUser = null

// Initialisation de la page d'authentification
document.addEventListener("DOMContentLoaded", () => {
  // Vérifier si l'utilisateur est déjà connecté
  checkAuthStatus()

  // Configuration des formulaires
  setupAuthForms()

  // Vérification de la force du mot de passe
  setupPasswordStrength()
})

// Vérifier le statut d'authentification
function checkAuthStatus() {
  const token = localStorage.getItem("authToken")
  const userData = localStorage.getItem("userData")

  if (token && userData) {
    try {
      currentUser = JSON.parse(userData)
      // Rediriger vers la page d'accueil si déjà connecté
      if (window.location.pathname.includes("login.html")) {
        window.location.href = "index.html"
      }
    } catch (e) {
      // Token invalide, nettoyer le localStorage
      logout()
    }
  }
}

// Configuration des formulaires d'authentification
function setupAuthForms() {
  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister)
  }

  const forgotForm = document.getElementById("forgot-form")
  if (forgotForm) {
    forgotForm.addEventListener("submit", handleForgotPassword)
  }
}

// Gestion de la connexion
async function handleLogin(e) {
  e.preventDefault()

  const email = document.getElementById("login-email").value
  const password = document.getElementById("login-password").value
  const rememberMe = document.getElementById("remember-me").checked

  if (!validateEmail(email)) {
    showError("Veuillez saisir un email valide")
    return
  }

  if (password.length < 6) {
    showError("Le mot de passe doit contenir au moins 6 caractères")
    return
  }

  try {
    showLoading("Connexion en cours...")

    // Simulation de l'authentification (à remplacer par un appel API réel)
    const loginResult = await simulateLogin(email, password)

    if (loginResult.success) {
      // Sauvegarder les données utilisateur
      const token = generateToken()
      localStorage.setItem("authToken", token)
      localStorage.setItem("userData", JSON.stringify(loginResult.user))

      if (rememberMe) {
        localStorage.setItem("rememberMe", "true")
      }

      currentUser = loginResult.user

      showSuccess("Connexion réussie ! Redirection...")

      // Redirection après 1 seconde
      setTimeout(() => {
        window.location.href = "index.html"
      }, 1000)
    } else {
      showError(loginResult.message || "Email ou mot de passe incorrect")
    }
  } catch (error) {
    console.error("Erreur de connexion:", error)
    showError("Une erreur est survenue lors de la connexion")
  } finally {
    hideLoading()
  }
}

// Gestion de l'inscription
async function handleRegister(e) {
  e.preventDefault()

  const formData = {
    firstName: document.getElementById("register-firstname").value,
    lastName: document.getElementById("register-lastname").value,
    email: document.getElementById("register-email").value,
    phone: document.getElementById("register-phone").value,
    password: document.getElementById("register-password").value,
    confirmPassword: document.getElementById("register-confirm").value,
    city: document.getElementById("register-city").value,
    postalCode: document.getElementById("register-postal").value,
    acceptTerms: document.getElementById("accept-terms").checked,
    acceptNewsletter: document.getElementById("accept-newsletter").checked,
  }

  // Validation des données
  if (!validateRegistrationData(formData)) {
    return
  }

  try {
    showLoading("Création du compte...")

    // Simulation de l'inscription (à remplacer par un appel API réel)
    const registerResult = await simulateRegister(formData)

    if (registerResult.success) {
      showSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.")

      // Basculer vers le mode connexion
      setTimeout(() => {
        switchAuthMode()
        document.getElementById("login-email").value = formData.email
      }, 1500)
    } else {
      showError(registerResult.message || "Erreur lors de la création du compte")
    }
  } catch (error) {
    console.error("Erreur d'inscription:", error)
    showError("Une erreur est survenue lors de la création du compte")
  } finally {
    hideLoading()
  }
}

// Validation des données d'inscription
function validateRegistrationData(data) {
  if (!data.firstName.trim()) {
    showError("Le prénom est requis")
    return false
  }

  if (!data.lastName.trim()) {
    showError("Le nom est requis")
    return false
  }

  if (!validateEmail(data.email)) {
    showError("Veuillez saisir un email valide")
    return false
  }

  if (data.phone && !validatePhone(data.phone)) {
    showError("Le numéro de téléphone n'est pas valide")
    return false
  }

  if (data.password.length < 8) {
    showError("Le mot de passe doit contenir au moins 8 caractères")
    return false
  }

  if (data.password !== data.confirmPassword) {
    showError("Les mots de passe ne correspondent pas")
    return false
  }

  if (!data.city.trim()) {
    showError("La ville est requise")
    return false
  }

  if (!data.postalCode.trim() || !/^\d{5}$/.test(data.postalCode)) {
    showError("Le code postal doit contenir 5 chiffres")
    return false
  }

  if (!data.acceptTerms) {
    showError("Vous devez accepter les conditions d'utilisation")
    return false
  }

  return true
}

// Simulation de la connexion (à remplacer par un appel API réel)
async function simulateLogin(email, password) {
  // Simulation d'un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Utilisateurs de test
  const testUsers = [
    {
      id: 1,
      email: "marie.leblanc@email.com",
      password: "password123",
      firstName: "Marie",
      lastName: "Leblanc",
      phone: "0123456789",
      city: "Paris",
      postalCode: "75015",
      isVerified: true,
      avatar: null,
    },
    {
      id: 2,
      email: "jean.dupont@email.com",
      password: "password123",
      firstName: "Jean",
      lastName: "Dupont",
      phone: "0987654321",
      city: "Lyon",
      postalCode: "69003",
      isVerified: true,
      avatar: null,
    },
    {
      id: 3,
      email: "test@test.com",
      password: "test123",
      firstName: "Test",
      lastName: "User",
      phone: "0147258369",
      city: "Marseille",
      postalCode: "13008",
      isVerified: false,
      avatar: null,
    },
  ]

  const user = testUsers.find((u) => u.email === email && u.password === password)

  if (user) {
    // Retirer le mot de passe des données utilisateur
    const { password: _, ...userWithoutPassword } = user
    return {
      success: true,
      user: userWithoutPassword,
    }
  } else {
    return {
      success: false,
      message: "Email ou mot de passe incorrect",
    }
  }
}

// Simulation de l'inscription (à remplacer par un appel API réel)
async function simulateRegister(userData) {
  // Simulation d'un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Vérifier si l'email existe déjà
  const existingEmails = ["marie.leblanc@email.com", "jean.dupont@email.com"]

  if (existingEmails.includes(userData.email)) {
    return {
      success: false,
      message: "Un compte avec cet email existe déjà",
    }
  }

  // Simulation de la création du compte
  return {
    success: true,
    message: "Compte créé avec succès",
  }
}

// Basculer entre connexion et inscription
function switchAuthMode() {
  isLoginMode = !isLoginMode

  const loginForm = document.getElementById("login-form")
  const registerForm = document.getElementById("register-form")
  const authTitle = document.getElementById("auth-title")
  const authSubtitle = document.getElementById("auth-subtitle")
  const authSwitch = document.getElementById("auth-switch")
  const forgotPassword = document.getElementById("forgot-password")

  if (isLoginMode) {
    loginForm.style.display = "block"
    registerForm.style.display = "none"
    authTitle.textContent = "Connexion"
    authSubtitle.textContent = "Connectez-vous pour accéder à votre compte"
    authSwitch.innerHTML =
      'Pas encore de compte ? <button type="button" class="link-button" onclick="switchAuthMode()">Créer un compte</button>'
    forgotPassword.style.display = "block"
  } else {
    loginForm.style.display = "none"
    registerForm.style.display = "block"
    authTitle.textContent = "Inscription"
    authSubtitle.textContent = "Créez votre compte pour commencer"
    authSwitch.innerHTML =
      'Déjà un compte ? <button type="button" class="link-button" onclick="switchAuthMode()">Se connecter</button>'
    forgotPassword.style.display = "none"
  }
}

// Configuration de la vérification de la force du mot de passe
function setupPasswordStrength() {
  const passwordInput = document.getElementById("register-password")
  if (passwordInput) {
    passwordInput.addEventListener("input", checkPasswordStrength)
  }
}

// Vérifier la force du mot de passe
function checkPasswordStrength() {
  const password = document.getElementById("register-password").value
  const strengthDiv = document.getElementById("password-strength")

  if (!password) {
    strengthDiv.innerHTML = ""
    return
  }

  let score = 0
  const feedback = []

  // Longueur
  if (password.length >= 8) score++
  else feedback.push("Au moins 8 caractères")

  // Minuscules
  if (/[a-z]/.test(password)) score++
  else feedback.push("Une minuscule")

  // Majuscules
  if (/[A-Z]/.test(password)) score++
  else feedback.push("Une majuscule")

  // Chiffres
  if (/\d/.test(password)) score++
  else feedback.push("Un chiffre")

  // Caractères spéciaux
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++
  else feedback.push("Un caractère spécial")

  let strength = ""
  let className = ""

  if (score < 2) {
    strength = "Très faible"
    className = "strength-very-weak"
  } else if (score < 3) {
    strength = "Faible"
    className = "strength-weak"
  } else if (score < 4) {
    strength = "Moyen"
    className = "strength-medium"
  } else if (score < 5) {
    strength = "Fort"
    className = "strength-strong"
  } else {
    strength = "Très fort"
    className = "strength-very-strong"
  }

  strengthDiv.innerHTML = `
        <div class="strength-bar ${className}">
            <div class="strength-fill"></div>
        </div>
        <div class="strength-text">Force: ${strength}</div>
        ${feedback.length > 0 ? `<div class="strength-feedback">Manque: ${feedback.join(", ")}</div>` : ""}
    `
}

// Afficher/masquer le mot de passe
function togglePassword(inputId) {
  const input = document.getElementById(inputId)
  const button = input.nextElementSibling
  const icon = button.querySelector("i")

  if (input.type === "password") {
    input.type = "text"
    icon.className = "fas fa-eye-slash"
  } else {
    input.type = "password"
    icon.className = "fas fa-eye"
  }
}

// Gestion du mot de passe oublié
function showForgotPassword() {
  document.getElementById("forgot-modal").classList.add("active")
}

function closeForgotModal() {
  document.getElementById("forgot-modal").classList.remove("active")
}

async function handleForgotPassword(e) {
  e.preventDefault()

  const email = document.getElementById("forgot-email").value

  if (!validateEmail(email)) {
    showError("Veuillez saisir un email valide")
    return
  }

  try {
    showLoading("Envoi du lien...")

    // Simulation de l'envoi d'email
    await new Promise((resolve) => setTimeout(resolve, 1000))

    showSuccess("Un lien de réinitialisation a été envoyé à votre email")
    closeForgotModal()
  } catch (error) {
    showError("Erreur lors de l'envoi du lien")
  } finally {
    hideLoading()
  }
}

// Déconnexion
function logout() {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userData")
  localStorage.removeItem("rememberMe")
  currentUser = null

  // Rediriger vers la page de connexion
  window.location.href = "login.html"
}

// Générer un token d'authentification
function generateToken() {
  return "token_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
}

// Obtenir l'utilisateur connecté
function getCurrentUser() {
  return currentUser
}

// Vérifier si l'utilisateur est connecté
function isAuthenticated() {
  return currentUser !== null && localStorage.getItem("authToken") !== null
}

// Fonctions utilitaires
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validatePhone(phone) {
  const re = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
  return re.test(phone.replace(/\s/g, ""))
}

function showError(message) {
  const errorDiv = document.createElement("div")
  errorDiv.className = "message message-error"
  errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`

  const container = document.querySelector(".auth-card") || document.body
  container.insertBefore(errorDiv, container.firstChild)

  setTimeout(() => {
    errorDiv.remove()
  }, 5000)
}

function showSuccess(message) {
  const successDiv = document.createElement("div")
  successDiv.className = "message message-success"
  successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`

  const container = document.querySelector(".auth-card") || document.body
  container.insertBefore(successDiv, container.firstChild)

  setTimeout(() => {
    successDiv.remove()
  }, 3000)
}

function showLoading(message = "Chargement...") {
  const loadingDiv = document.createElement("div")
  loadingDiv.id = "loading-overlay"
  loadingDiv.className = "loading-overlay"
  loadingDiv.innerHTML = `
        <div class="loading-content">
            <div class="loading-spinner"></div>
            <div class="loading-text">${message}</div>
        </div>
    `

  document.body.appendChild(loadingDiv)
}

function hideLoading() {
  const loadingDiv = document.getElementById("loading-overlay")
  if (loadingDiv) {
    loadingDiv.remove()
  }
}
