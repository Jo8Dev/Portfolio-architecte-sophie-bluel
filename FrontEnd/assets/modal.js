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
            alert("l'element a bien ete supprimé")
        })
    });
}

function displayAddWorks() {
    //recuperation et creation des elements
    const title = document.querySelector(".modal-content p")
    const backButton = document.querySelector(".modal-nav i")

    //modification
    title.textContent = "Ajout photo"
    backButton.classList.add("fa-solid", "fa-arrow-left")
}

/**
 * Gestion des boutons pour ouvrir ou fermer la modale
 */
export function handleModal() {
    const dialog = document.querySelector("dialog");
    const showButton = document.querySelector(".edit a");
    const closeButton = document.querySelector(".close");
    const addButton = document.querySelector(".modal-content .btn")

    // écoute du bouton modifier afin d'ouvrir la fenetre de dialogue
    showButton.addEventListener("click", async () => {
        dialog.showModal();
        displayModalGallery(await index.getWorks());
        deleteWork();
    });

    // écoute du bouton X afin de fermer la fenetre de dialogue
    closeButton.addEventListener("click", () => {
        dialog.close();
    });

    // écoute du bouton ajouter une photo afin d'ouvrir la page 2 de la modale
    addButton.addEventListener("click", () => {
        displayAddWorks()
    })

    //écoute de la fleche de retour 
};