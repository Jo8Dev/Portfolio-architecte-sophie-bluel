import { API_URL } from "./config.js";

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

// Fonction pour récupérer les catégories
async function getCategories() {
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
    createListBtn(0, 'tous');

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
async function getWorks() {
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

function checkToken() {
    if (localStorage.getItem('token')) {
        return true
    }
    return false
};

function displayEditionMode() {
    //ajout du bandeau du mode edition
    const banner = document.querySelector('.banner');
    banner.style.display = 'flex';
    banner.style.visibility = 'visible';
    //transformation de login en logout
    document.querySelector('#login-link').textContent = "logout";

}

/*function hideEditionMode() {
    const banner = document.querySelector('.banner');
    banner.style.display = 'none';
    banner.style.visibility = 'hidden';
}*/

function displayModalGallery(datas) {
    const gallery = document.querySelector('dialog .gallery');
    gallery.innerHTML = '';//Reinitialise .gallery
    for (const data of datas) {
        const figure = document.createElement('figure');
        figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}">`;
        gallery.appendChild(figure);
    }
}

//Test sur la présence ou non du token d'identification et gestion de l'affichage Works et Catégorie ou Mode edition
if (checkToken()) {
    displayEditionMode();
    displayWorks(await getWorks());
} else {
    displayWorks(await getWorks());
    displayCategories(await getCategories());
}

const dialog = document.querySelector("dialog");
const showButton = document.querySelector(".modalLink");
const closeButton = document.querySelector(".close");

// Le bouton "Afficher la fenêtre" ouvre le dialogue
showButton.addEventListener("click", async () => {
    dialog.showModal();
    displayModalGallery(await getWorks())
    console.log(document.querySelector('dialog .gallery'))
});

// Le bouton "Fermer" ferme le dialogue
closeButton.addEventListener("click", () => {
    dialog.close();
});