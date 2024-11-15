import { API_URL } from "./config.js";

async function login(email, password) {
    try {
        const resp = await fetch(API_URL + '/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            })
        })
        if (!resp.ok) {
            throw new Error(resp.status);
        }

        return await resp.json();
    }
    catch (error) {
        displayError()
    }
}


/*****Récuperation et écoute du formulaire***/
const form = document.querySelector('form');

form.addEventListener("submit", async (e) => {
    // On empêche le comportement par défaut
    e.preventDefault();

    //creation d'un Objet formdata
    const formData = new FormData(form);

    // Récuperation des deux champs
    const inputEmail = formData.get("email");
    const inputPassword = formData.get("password");

    //appel de la fonction login()
    storeToken(await login(inputEmail, inputPassword));
});

function storeToken(datas) {
    const token = 'token'
    localStorage.setItem(token, datas.token);
    window.location.href = "index.html"
}

function displayError() {
    alert("Erreur dans l’identifiant ou le mot de passe")   
}


