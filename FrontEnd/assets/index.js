import { API_URL } from "./config.js";
import * as modal from "./modal.js";

/**
 * Création des boutons avec classe et id
 * @param {number} id 
 * @param {string} name 
 */
function createListBtn(id, name) {
    //Recupération/Creation de la liste de bouttons et des buttons
    const ulBtnGroup = document.querySelector(".btn-group");
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.innerText = name;


    btn.addEventListener("click", async () => {
        let works = await getWorks();

        if (id !== 0) {
            works = filterWorks(works, id);
        }

        displayWorks(works);
    });

    ulBtnGroup.appendChild(li);
    li.appendChild(btn);
};

/**
 *Fonction pour récupérer les catégories  
 */
export async function getCategories() {
    const resp = await fetch(API_URL + "/categories");
    if (!resp.ok) throw new Error(resp.status);

    return await resp.json();
};

/**
 * Affiche les boutons
 * @param {*} categories 
 */
function displayCategories(categories) {
    //creation du premier bouton
    createListBtn(0, 'Tous');

    //creation des boutons de l'API
    for (const categorie of categories) {
        createListBtn(categorie.id, categorie.name);
    }
};

/**
 * Crée les éléments et ajoute les données récupérées de l'API aux éléments
 * @param {Array} datas Data des travaux (works)
 */
function displayWorks(datas) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';//Reinitialise .gallery
    for (const data of datas) {
        const figure = document.createElement('figure');
        figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}"><figcaption>${data.title}</figcaption>`;
        gallery.appendChild(figure);
    }
};

/**
 * Lance le fetch API et ajoute les données
 */
export async function getWorks() {
    const requete = await fetch(API_URL + "/works");
    if (!requete.ok) throw new Error(requete.status);

    return await requete.json();
};

/**
 * Filtre les elements à afficher
 * @param {number} id 
 */
function filterWorks(works, id) {
    return works.filter((work) => work.categoryId === id);
};

/**
 * Vérifie la présence de token et sa validité
 * @returns boolean
 */
function isTokenExpired() {
    const token = localStorage.getItem("token");
    
    if (!token) {
        return true; // Pas de token, on considère qu'il est expiré.
    }
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationDate = new Date(payload.exp * 1000);
        return new Date() > expirationDate; // Retourne true si le token est expiré.
    } catch (e) {
        return true; // En cas d'erreur (token mal formé), on considère qu'il est expiré.
    }
}


/**
 * Affichage du mode edition pour l'utilisateur connecte
 */
function displayEditionMode() {
    //ajout du bandeau du mode edition
    const banner = document.querySelector(".banner");
    banner.style.display = 'flex';
    banner.style.visibility = 'visible';

    //ajout du bouton modifier
    const modalLink = document.querySelector(".edit a");
    modalLink.style.display = 'flex';
    modalLink.style.visibility = 'visible';

    //Ajustement du header a cause de la barrier en position fixed
    const header = document.querySelector(".header");
    header.style.marginTop = "80px";

    //transformation de login en logout
    document.querySelector('#login-link').textContent = "logout";
    document.querySelector('#login-link').addEventListener('click', () => {
        window.localStorage.removeItem("token");
    })

};

//Gestion de l'affichage Works et Catégorie ou Mode edition en fonction de la présence ou non et de l'expiration ou non du token
if (!isTokenExpired()) {
    displayEditionMode();//Affiche le mode edition
    displayWorks(await getWorks());//Affiche les travaux dans la mini gallery
    modal.handleModal();//Gestion la modale

} else {
    displayWorks(await getWorks());//Affiche les travaux dans la gallery
    displayCategories(await getCategories());//Affiche les boutons de tri
};
