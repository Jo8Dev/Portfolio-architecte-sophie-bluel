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

    // Récuperation des deux champs
    const inputEmail = document.getElementById("email").value;
    const inputPassword = document.getElementById("password").value;

    //appel de la fonction login()
    storeToken(await login(inputEmail, inputPassword));
});

function storeToken(datas) {
    localStorage.setItem(datas.userId, datas.token);
    window.location.href = "index.html"
}

function displayError() {
    alert("L'identifiant ou le mot de passe saisi est incorrect. Veuillez essayer à nouveau.")   
}



