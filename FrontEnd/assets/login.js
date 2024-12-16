import { login } from "./manager.js";

/***** Récupération et écoute du formulaire ***/
const form = document.querySelector('form');

form.addEventListener("submit", async (e) => {
    try {
        // On empêche le comportement par défaut
        e.preventDefault();

        // Création d'un objet FormData
        const formData = new FormData(form);

        // Récupération des deux champs
        const inputEmail = formData.get("email");
        const inputPassword = formData.get("password");

        // Appel de la fonction login()
        const response = await login(inputEmail, inputPassword);

        // Stockage du token et redirection
        storeToken(response);
    } catch (error) {
        alert("Erreur dans l’identifiant ou le mot de passe");
    }
})

/**
 * Fonction pour stocker le token dans le localStorage et rediriger
 * @param { String } datas - Données de réponse contenant le token
 */
function storeToken(datas) {
    const token = 'token'
    localStorage.setItem(token, datas.token);
    window.location.href = "index.html";
}

