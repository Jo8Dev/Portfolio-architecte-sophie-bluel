//Récupérations d'element du Dom
const gallery = document.querySelector('.gallery')

/**
 * Crée les différents éléments à rattacher au DOM et ajoute les données récupéré de l'Api aux élements
 * @param {.json()} datas ---------------------------??quoi mettre?? ---------------------------------------------------------------
 */
function addContent(datas) {
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
//fetch api
const url = "http://localhost:5678/api/works"
fetch(url)
    .then((response) => {
        return response.json()
    })
    .then((works) => {
        addContent(works)
    })



