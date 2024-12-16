import { API_URL } from "./config.js";

export let cache = new Map();


/**
 * Récupération des travaux
 * @returns {Promise<[]>} Promesse contenant un array contenant les travaux en cas de succès
 */
export async function getWorks() {
    // Vérifie si les travaux sont déjà dans le cache
    if (cache.has("works")) return cache.get("works");

    // Si non, récupère les données depuis l'API
    const requete = await fetch(`${API_URL}/works`);
    if (!requete.ok) throw new Error(`Erreur ${requete.status}`);
    const works = await requete.json();

    // Stocke les données dans le cache et les retourne
    cache.set("works", works);
    return works;
}

/**
 * Récupération des catégories
 * @returns {Promise<[]>} Promesse contenant un array contenant les catégories en cas de succès
 */
export async function getCategories() {
    // Vérifie si les catégories sont déjà dans le cache
    if (cache.has("categories")) return cache.get("categories");

    // Si non, récupère les données depuis l'API
    const resp = await fetch(`${API_URL}/categories`);
    if (!resp.ok) throw new Error(`Erreur ${resp.status}`);
    const categories = await resp.json();

    // Stocke les données dans le cache et les retourne
    cache.set("categories", categories);
    return categories;
}

/**
 * Suppression des travaux de l'API
 * @param {Number} id 
 * @param {String} token 
 */
export async function deleteWork(id, token) {
    const resp = await fetch(API_URL + "/works/" + id, {
        method: "DELETE",
        headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!resp.ok) {
        throw new Error(resp.status);
    }
    alert("L'élément a bien été supprimé.");
}

/**
 * Post des travaux dans l'API
 * @param {Object<formData>} formData 
 * @param {String} token 
 */
export async function postWork(token, formData) {
    const response = await fetch(`${API_URL}/works`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error(`Erreur : ${response.status}`);
    }
    alert("L'élément a été ajouté avec succès !");
}

/**
 * Fonction pour effectuer une connexion utilisateur
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Object} - Données de réponse contenant le token
 */
export async function login(email, password) {
    const resp = await fetch(API_URL + '/users/login', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });

    if (!resp.ok) {
        throw new Error(resp.status);
    }

    return await resp.json();
}