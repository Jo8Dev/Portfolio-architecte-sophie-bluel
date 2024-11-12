// Récupération des éléments du DOM
const gallery = document.querySelector('.gallery')
const btnGroup = document.querySelector(".btn-group")


/**
 * Création des boutons avec classe et id
 * @param {number} id 
 * @param {string} name 
 */
function createListBtn(id, name) {
    //Recupération/Creation de la liste de bouttons et des buttons
    const li = document.createElement('li');
    li.innerHTML = `<button class="btn" id="${id}"> ${name} </button>`
    btnGroup.appendChild(li)
}

// Fonction pour récupérer les catégories et générer les boutons
async function getCategories() {
    const url = "http://localhost:5678/api/categories"
    try {
        const resp = await fetch(url)
        if (!resp.ok) throw new Error(resp.status)

        const categories = await resp.json()
        
        // Création du bouton "Tous"
        createListBtn(0, 'Tous')
    
        // Création des boutons pour chaque catégorie
        for (const categorie of categories) {
            createListBtn(categorie.id, categorie.name)
        }

        // Récupération de tous les boutons une fois créés
        const listBtn = document.querySelectorAll(".btn")
        listBtn.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const btnId = parseInt(event.target.id);
                if (btnId === 0) {
                    getWorks();
                } else {
                    filterWorks(btnId);
                }
            });
        });

    } catch (error) {
        console.error(error.message);
    }
}
/**
 * Crée les éléments et ajoute les données récupérées de l'API aux éléments
 * @param {Array} datas Data des travaux (works)
 */
function addWorks(datas) {
    gallery.innerHTML = ''//Reinitialise .gallery
    for (const data of datas) {
        const figure = document.createElement('figure');
        figure.innerHTML = `<img src="${data.imageUrl}" alt="${data.title}"><figcaption>${data.title}</figcaption>`;
        gallery.appendChild(figure);
    }
}

/**
 * Lance le fetch API et ajoute les données
 */
async function getWorks() {
    const url = "http://localhost:5678/api/works"
    try {
        const requete = await fetch(url)
        if (!requete.ok) {
            throw new Error(requete.status)
        }
        else {
            let works = await requete.json()
            addWorks(works)
        }
    } catch (error) {
        console.error(error.message)
    }
}

/**
 * Filtre les elements a afficher apres un nouveau fetch
 * @param {number} id 
 */
async function filterWorks(id) {
    const url = "http://localhost:5678/api/works"
    try {
        const requete = await fetch(url)
        if (!requete.ok) {
            throw new Error(requete.status)
        }
        else {
            let works = await requete.json()
            const filteredWorks = Array.from(works)
            addWorks(filteredWorks.filter((work) => work.categoryId == id))
        }

    } catch (error) {
        console.error(error.message)
    }

}

getCategories()
getWorks()



