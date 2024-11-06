//Récupérations d'element du Dom
const gallery = document.querySelector('.gallery')
const btnGroup = document.querySelectorAll('.btn')

/**
 * Crée les différents éléments à rattacher au DOM et ajoute les données récupéré de l'API aux élements
 * @param {.json()} datas ---------------------------??quoi mettre?? ---------------------------------------------------------------
 */
function addContent(datas) {
    gallery.innerHTML = ''//Reinitialise .gallery
    for (const data of datas) {
        const figure = document.createElement('figure')
        const image = document.createElement('img')
        const figcaption = document.createElement('figcaption')

        image.src = data.imageUrl
        figcaption.innerText = data.title
        gallery.appendChild(figure)
        figure.appendChild(image)
        figure.appendChild(figcaption)
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
            addContent(works)
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
            addContent(filteredWorks.filter((work) => work.categoryId == id))
        }

    } catch (error) {
        console.error(error.message)
    }

}

getWorks(gallery)

//Ecoute de l'evenement click sur les boutons et affichage des elements en fonction du bouton sélectionné
for (const btn of btnGroup) {
    const btnId = btn.id
    btn.addEventListener('click', () => {
        switch (btnId) {
            case 'tout':
                getWorks()
                break
            case 'objets':
                filterWorks(1)
                break
            case 'appartement':
                filterWorks(2)
                break
            case 'hotels&restaurant':
                filterWorks(3)
        }
    })
}