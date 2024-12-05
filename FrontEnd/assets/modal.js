import * as index from "./index.js";
import { API_URL } from "./config.js";

/**
 * Injecte un template dans le conteneur de la modale.
 * @param {string} templateId - ID du template à injecter.
 */
function injectTemplate(templateId) {
    const container = document.getElementById("template-container");
    const template = document.getElementById(templateId).content.cloneNode(true);

    // Nettoie le contenu avant d'ajouter un nouveau template
    container.innerHTML = "";
    container.appendChild(template);
}

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
        title.textContent = "Galerie photo";

        //ajout des élément aux DOM
        figure.appendChild(trashIcon);
        trashIcon.appendChild(icon);
        figure.appendChild(image);
        gallery.appendChild(figure);
    };
}

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

            // Recharge la galerie sans recharger la page
            const updatedWorks = await index.getWorks(); // Appel à l'API pour récupérer les nouvelles données
            displayModalGallery(updatedWorks); // Affiche la galerie mise à jour
            deleteWork();
        });
    });
}

/**
 * Gere la prévisualisation de la photo sélectionné
 */
function previewFile() {
    // Récupération des éléments
    const fileInput = document.querySelector("#file");
    const previewPhoto = document.querySelector('.add-photo');

    fileInput.addEventListener("change", () => {
        const file = fileInput.files[0]; // Récupère le premier fichier sélectionné

        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();

            reader.onload = (e) => {
                previewPhoto.src = e.target.result; // Affiche l'image dans l'élément <img>

            };

            reader.readAsDataURL(file); // Lit le fichier comme une URL de données
        }
    });
}

/**
 * Affiche les catégories dans le select via un fetch API
 * @param {Function} data fonction du fetch api
 */
async function displayModalCategorie(data = []) {
    const categorie = document.querySelector('#categorie');

    await data.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id; 
        option.textContent = cat.name;
        categorie.appendChild(option);
    });
}

/**
 * Gere le bouton valider qui est grisé tant que le formulaire n'est pas totalement rempli
 */
function handleSubmitButton() {
    const fileInput = document.querySelector('#file');
    const titleInput = document.querySelector('#title');
    const submitButton = document.querySelector('button[type="submit"]');

    function checkFormValidity() {
        if (fileInput.files.length > 0 && titleInput.value !== '') {
            submitButton.disabled = false;
            submitButton.classList.remove('btn-disabled');
        } else {
            submitButton.disabled = true;
            submitButton.classList.add('btn-disabled');
        }
    }

    fileInput.addEventListener('change', checkFormValidity);
    titleInput.addEventListener('input', checkFormValidity);
}

async function addWork() {
    const form = document.querySelector('.add-photo-form');
    const formData = new FormData();

    // Ajout des champs au FormData
    const fileInput = document.querySelector('#file');
    const titleInput = document.querySelector('#title');
    const categorySelect = document.querySelector('#categorie');

    formData.append('image', fileInput.files[0]);
    formData.append('title', titleInput.value);
    formData.append('category', categorySelect.value);

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/works`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        alert("L'élément a été ajouté avec succès !");

        // Réinitialise le formulaire
        form.reset();

        // Réinitialise l'image de prévisualisation (si présente)
        const previewPhoto = document.querySelector('.add-photo');
        if (previewPhoto) {
            previewPhoto.src = ''; // Supprime l'image affichée
        }

        handleModal(); // Réactualisation de la galerie ou fermeture de la modale
        location.reload();//recharge la page suite a la soumission du formulaire ???????????????????????????

    } catch (error) {
        console.error('Erreur lors de l\'ajout :', error);
        alert("Une erreur s'est produite lors de l'ajout.");
    }
}

/**
 * 
 * @param {Element} button Cache les boutons
 */
function hideButton(button) {
    button.style.visibility = "hidden";
    if (button.id !== ("back")) {
        button.style.display = "none";
    }
}

/**
 * 
 * @param {Element} button Affiche les boutons
 */
function displayButton(button) {
    button.style.visibility = "visible";
    if (button.id !== ("back")) {
        button.style.display = "inline-block";
    }
}

/**
 * Gestion des boutons pour ouvrir ou fermer la modale
 */
export function handleModal() {
    //recuperation des elements
    const dialog = document.querySelector("dialog");
    const showButton = document.querySelector(".edit a");
    const showButtonBanner = document.querySelector(".banner span")
    const closeButton = document.querySelector(".close");
    const addButton = document.querySelector("dialog .btn");
    const backButton = document.querySelector("#back");



    // écoute du bouton modifier afin d'ouvrir la fenetre de dialogue
    [showButton, showButtonBanner].forEach(button => {
        button.addEventListener("click", async () => {
            dialog.showModal();
            injectTemplate("modal-gallery-layout");//Ajout du template mini gallery
            displayModalGallery(await index.getWorks());
            deleteWork();
            hideButton(backButton);
            displayButton(addButton);
        })
    });

/**
 * Gere l'affichage du formulaire d'envoi de photo
 */
async function handleAddForm() {
    previewFile();
    displayModalCategorie();
    displayModalCategorie(await index.getCategories());
    handleSubmitButton();
    document.querySelector('.add-photo-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Empêche le rechargement de la page
        addWork();
    });
}


    // écoute du bouton X afin de fermer la fenetre de dialogue
    closeButton.addEventListener("click", () => {
        dialog.close();
        location.reload();
    });

    // écoute du bouton ajouter une photo afin d'ouvrir la page 2 de la modale
    addButton.addEventListener("click", () => {
        injectTemplate("modal-add-layout");
        handleAddForm();
        displayButton(backButton);
        hideButton(addButton);
    });

    //écoute de la fleche de retour 
    backButton.addEventListener("click", async () => {
        injectTemplate("modal-gallery-layout");
        displayModalGallery(await index.getWorks());
        deleteWork();
        hideButton(backButton);
        displayButton(addButton);
    });

    // Fermer le dialog en cliquant sur le backdrop
    window.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
            location.reload();//??????????????????????????????????????????
        }
    });
}

