import {handleModal} from "./modal.js";
import {getCategories, getWorks, cache} from './manager.js';

/**
 * Création des boutons avec classe et id
 * @param {number} id 
 * @param {string} name 
 */
function createFilteringBtn(id, name) {
    //Recupération/Creation de la liste de bouttons et des buttons
    const ulBtnGroup = document.querySelector(".btn-group");
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.classList.add('btn');
    btn.innerText = name;

    //ajout d'un listener sur le bouton afin de filtrer
    btn.addEventListener("click", async () => {
        let works = cache.get("works");

        if (id !== 0) {
            //Filtre des catégories rattacher aux boutons par ID
            works = filterWorks(works, id);
        }

        displayWorks(works);
    });

    ulBtnGroup.appendChild(li);
    li.appendChild(btn);
};

/**
 * Affiche les boutons de catégories
 * @param {Array} categories array contenant les catégories 
 */
async function displayCategories(categories) {
    //creation du premier bouton
    createFilteringBtn(0, 'Tous');

    //creation des boutons de l'API
    for (const category of categories) {
        createFilteringBtn(category.id, category.name);//Récuperation de l'id et du name de l'API
    }
};

/**
 * Crée les éléments et ajoute les données récupérées de l'API aux éléments
 * @param {Array} datas Data des travaux (works)
 */
export async function displayWorks(datas) {
    const gallery = document.querySelector('.gallery');
    gallery.innerHTML = '';//Reinitialise .gallery
    for (const data of datas) {
        const figure = document.createElement('figure');
        figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}"><figcaption>${data.title}</figcaption>`;
        gallery.appendChild(figure);
    }
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
 * Affichage du mode edition pour l'utilisateur connecté
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

}

//Gestion de l'affichage Works et Catégorie, ou Mode edition en fonction de la présence et de l'expiration du token
if (!isTokenExpired()) {
    displayEditionMode();//Affiche le mode edition
    displayWorks(await getWorks());//Affiche les travaux dans la gallery
    handleModal();//Gestion la modale

} else {
    displayWorks(await getWorks());//Affiche les travaux dans la gallery
    displayCategories(await getCategories());//Affiche les boutons de tri
};
