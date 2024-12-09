import { getWorks, getCategories, deleteWork, cache, } from "./manager.js";
import { displayWorks } from "./index.js";
import { API_URL } from "./config.js";

//Initialisation de variable
const token = localStorage.getItem("token");

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
function displayModalGallery(datas) {
    const gallery = document.querySelector('dialog .gallery');
    gallery.innerHTML = ''; // Réinitialise .gallery

    // Ajout du texte
    document.querySelector(".modal-content p").textContent = "Galerie photo";

    datas.forEach(data => {
        // Création des éléments nécessaires
        const figure = document.createElement("figure");
        const image = document.createElement("img");
        const trashIcon = createTrashIcon();

        // Configuration de l'image
        image.src = data.imageUrl;
        image.alt = data.title;

        // Assemblage des éléments
        figure.append(trashIcon, image);
        gallery.appendChild(figure);

        // Écoute du clic sur trash icon
        trashIcon.addEventListener("click", async () => {
            await handleTrashClick(data.id);
        });
    });
}

// Fonction pour créer l'icône de suppression
function createTrashIcon() {
    const trashIcon = document.createElement("span");
    const icon = document.createElement("i");

    trashIcon.classList.add("trash-icon");
    icon.classList.add("fa-duotone", "fa-solid", "fa-trash-can");

    trashIcon.appendChild(icon);
    return trashIcon;
}

// Fonction pour gérer la suppression d'un élément
async function handleTrashClick(id) {
    await deleteWork(id, token);
    cache.delete("works"); // Vide le cache contenant les works
    const works = await getWorks();
    displayModalGallery(works);
    displayWorks(works);
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
async function displayModalCategories(data = []) {
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
            displayModalGallery(await getWorks());
            hideButton(backButton);
            displayButton(addButton);
        })
    });

    /**
     * Gere l'affichage du formulaire d'envoi de photo
     */
    async function handleAddForm() {
        previewFile();
        displayModalCategories(await getCategories())
        handleSubmitButton();
        document.querySelector('.add-photo-form').addEventListener('submit', (e) => {
            e.preventDefault(); // Empêche le rechargement de la page
            addWork();
        });
    }

    // écoute du bouton X afin de fermer la fenetre de dialogue
    closeButton.addEventListener("click", () => {
        dialog.close();
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
        displayModalGallery(await getWorks());
        hideButton(backButton);
        displayButton(addButton);
    });

    // Fermer le dialog en cliquant sur le backdrop
    window.addEventListener('click', (e) => {
        if (e.target === dialog) {
            dialog.close();
        }
    });
}

