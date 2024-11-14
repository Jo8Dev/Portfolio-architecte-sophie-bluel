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
    li.appendChild(btn)
}

// Fonction pour récupérer les catégories
async function getCategories() {
    const resp = await fetch(API_URL + "/categories");
    if (!resp.ok) throw new Error(resp.status);

    return await resp.json();
}

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
}


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
    };
}

/**
 * Lance le fetch API et ajoute les données
 */
async function getWorks() {
    const requete = await fetch(API_URL + "/works");
    if (!requete.ok) throw new Error(requete.status);

    return await requete.json();
}

/**
 * Filtre les elements à afficher
 * @param {number} id 
 */
function filterWorks(works, id) {
    return works.filter((work) => work.categoryId === id);
}


//Affichage Categories et Works
displayCategories(
    await getCategories(),
);

displayWorks(
    await getWorks(),
);


