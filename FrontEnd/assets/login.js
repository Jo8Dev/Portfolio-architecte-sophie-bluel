async function login(email, password) {
    const url = "http://localhost:5678/api/users/login"
    try {
        const resp = await fetch(url, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        if (!resp.ok) {
            throw new Error(resp.status)
        }
        else {
            const result = await resp.json()
            console.log(result)
            alert(result.message)
        }
    }
    catch {
        console.error(error.message)
    }
}

/*****Récuperation et écoute du formulaire***/
const form = document.querySelector('form')

form.addEventListener("submit", (e) => {
    // On empêche le comportement par défaut
    e.preventDefault()

    // Récuperation des deux champs
    const inputEmail = document.getElementById("email").value
    const inputPassword = document.getElementById("motsDePasse").value

    //appel de la fonction login()
    login(inputEmail, inputPassword)
});