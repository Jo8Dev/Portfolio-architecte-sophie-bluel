import * as index from "./index.js";
import { API_URL } from "./config.js";

/**
 * Affichage de la mini galerie de la modale
 */
export function displayModalGallery(datas) {
    const gallery = document.querySelector('dialog .gallery');
    gallery.innerHTML = '';//Reinitialise .gallery
    for (const data of datas) {

        //Creation des different element à ajouter à la popup
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const icon = document.createElement('i');
        const trashIcon = document.createElement("span");
        const title = document.querySelector(".modal-content p")


        //ajout de classes
        trashIcon.classList.add("trash-icon");
        trashIcon.id = data.id;//Ajoute un id = à l'id du work dans l'api pour la suppression
        icon.classList.add("fa-duotone", "fa-solid", "fa-trash-can");//Affiche les icone de suprssion

        //ajout des images
        image.src = data.imageUrl;
        image.alt = data.title;

        //ajout du texte
        title.textContent = "Galerie photo"

        //ajout des élément aux DOM
        figure.appendChild(trashIcon);
        trashIcon.appendChild(icon);
        figure.appendChild(image);
        gallery.appendChild(figure);
    }
};

/**
 * fonction pour supprimer les travaux de l'API
 */
export function deleteWork() {
    const btnDeleteNodelist = document.querySelectorAll(".trash-icon");
    const btnDelete = Array.from(btnDeleteNodelist);

    btnDelete.forEach(btn => {
        btn.addEventListener("click", async () => {

            const token = localStorage.getItem("token");//Récuperation du token

            const resp = await fetch(API_URL + "/works/" + btn.id, {
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
        });
    });
}
/*******************A finir ***********************/

function handleAddForm() {
    //creation d'un Objet formdata
    const addForm = new FormData(document.querySelector(".add-photo-form"));
    const categorie = addForm.get("categorie");

    forEach

    addForm.addEventListener("submit", () => {
        // Récuperation des deux champs
        const file = addForm.get("file");
        const title = addForm.get("title");
    })
}

/**
 * 
 * @param {img} image 
 * @param {string} title 
 * @param {string} categorie 
 */
async function addWork(image, title, categorie) {
    const resp = await fetch(API_URL + "/works", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(image, title, categorie),
    })
}

/*******************A finir ***********************/

/**
 * Injecte un template dans le conteneur de la modale.
 * @param {string} templateId - ID du template à injecter.
 */
function injectTemplate(templateId) {
    const container = document.getElementById("modal-container");
    const template = document.getElementById(templateId).content.cloneNode(true);

    // Nettoie le contenu avant d'ajouter un nouveau template
    container.innerHTML = "";
    container.appendChild(template);
}

/**
 * Gestion des boutons pour ouvrir ou fermer la modale
 */
export function handleModal() {
    //recuperation des elements
    const dialog = document.querySelector("dialog");
    const showButton = document.querySelector(".edit a");
    const closeButton = document.querySelector(".close");
    const addButton = document.querySelector("dialog .btn");
    const backButton = document.querySelector("#back");


    // écoute du bouton modifier afin d'ouvrir la fenetre de dialogue
    showButton.addEventListener("click", async () => {
        dialog.showModal();
        injectTemplate("modal-gallery-layout");//Ajout du template mini gallery
        displayModalGallery(await index.getWorks());
        deleteWork();
        backButton.style.visibility = 'hidden';
        addButton.style.visibility = "visible";
    });


    // écoute du bouton X afin de fermer la fenetre de dialogue
    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    // écoute du bouton ajouter une photo afin d'ouvrir la page 2 de la modale
    addButton.addEventListener("click", () => {
        injectTemplate("modal-add-layout");
        backButton.style.visibility = 'visible';
        addButton.style.visibility = "hidden";
        handleAddForm();
    });

    //écoute de la fleche de retour 
    backButton.addEventListener("click", async () => {
        injectTemplate("modal-gallery-layout");
        displayModalGallery(await index.getWorks());
        deleteWork();
        backButton.style.visibility = 'hidden';
        addButton.style.visibility = "visible";
    });
};

