import { API_URL } from "./config.js";

export let cache = new Map();

/**
 * Récupération des travaux
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
 */
export async function deleteWork(id, token) {

    const resp = await fetch(API_URL + "/works/" + id, {
        method: "DELETE",
        headers: {
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
        }
    });
    if (!resp.ok) {
        throw new Error(resp.status);
    };
    alert("l'element a bien ete supprimé");
};


