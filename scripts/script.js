/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu. 
 * 
 *********************************************************************************/

/**
 * Affiche le score de l'utilisateur dans la zone définie sur l'interface.
 * @param {number} score - Le score de l'utilisateur.
 * @param {number} nbMotsProposes - Le nombre de mots proposés à l'utilisateur.
 */
function afficherResultat(score, nbMotsProposes) {
    let spanScore = document.querySelector(".zoneScore span")
    let affichageScore = `${score} / ${nbMotsProposes}`
    spanScore.innerText = affichageScore
}

/**
 * Affiche une proposition que le joueur doit recopier dans l'interface utilisateur.
 * @param {string} proposition - La phrase ou le mot à afficher comme proposition à l'utilisateur.
 */
function afficherProposition(proposition) {
    let inputEcriture = document.getElementById("inputEcriture")
    let zoneProposition = document.querySelector(".zoneProposition")
    inputEcriture.placeholder = proposition
    zoneProposition.innerText = proposition
    zoneProposition.style.backgroundColor = "white"
    zoneProposition.style.color = "#f76c5e"
}

/**
 * Crée et affiche un lien mail pour envoyer le score par email.
 * @param {string} nom - Le nom du joueur.
 * @param {string} email - L'email du destinataire avec qui le score doit être partagé.
 * @param {string} score - Le score à partager.
 */
function afficherEmail(nom, email, score) {
    let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} sur le site d'Azertype !`
    location.href = mailto
}

/**
 * Valide si le nom du joueur est conforme (minimum 2 caractères).
 * @param {string} nom - Le nom à valider.
 * @throws {Error} Si le nom est trop court.
 */
function validerNom(nom) {
    let regle = new RegExp("\\w{2}")

    if (nom.trim() === "" || !(regle.test(nom))) {
        throw new Error(`Le nom est trop court`)
    }
}

/**
 * Valide si l'email du joueur est conforme à une expression régulière.
 * @param {string} email - L'adresse e-mail à valider.
 * @throws {Error} Si l'e-mail n'est pas valide.
 */
function validerEmail(email) {
    let regle = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    if (!regle.test(email)) {
        throw new Error(`L'e-mail n'est pas valide`)
    }
}

/**
 * Affiche un message d'erreur dans l'interface en cas de validation échouée.
 * @param {string} message - Le message d'erreur à afficher.
 */
function afficherMessageErreur(message) {
    let spanErreurMessage = document.getElementById("spanErreur")

    if (!spanErreurMessage) {
        let popup = document.querySelector(".popup")
        spanErreurMessage = document.createElement("span")
        spanErreurMessage.id = "spanErreur"
        popup.append(spanErreurMessage)
    }

    spanErreurMessage.innerText = message
}

/**
 * Gère la soumission du formulaire de partage de score et valide les champs.
 * @param {number} score - Le score du joueur à partager.
 */
function gererFormulaire(score) {
    const form = document.querySelector("form")
    form.addEventListener("submit", (event) => {
        event.preventDefault()

        const nom = document.getElementById("nom")
        const email = document.getElementById("email")
        try {
            validerNom(nom.value)
            validerEmail(email.value)
            afficherMessageErreur("")
            afficherEmail(nom.value, email.value, score)
        } catch (erreur) {
            afficherMessageErreur(erreur.message)
        }
    })
}

/**
 * Lance le jeu, initialise les variables, gère le timer, les événements et la logique du jeu.
 */
function lancerJeu() {
    // Initialisations
    initAddEventListenerPopup()
    let score = 0
    let i = 0
    let listeProposition = listeMots

    let btnValiderMot = document.getElementById("btnValiderMot")
    let inputEcriture = document.getElementById("inputEcriture")
    let audio = document.getElementById("audio")
    let tempsRestant = 60; // Le temps initial en secondes
    let timerElement = document.getElementById("timer")
    let interval

    afficherProposition(listeProposition[i])

    inputEcriture.addEventListener("input", () => {
        if (inputEcriture.value != "" && !interval) {
            interval = setInterval(() => {
                if (tempsRestant > 0) {
                    tempsRestant--
                    timerElement.textContent = tempsRestant
                } else {
                    clearInterval(interval)
                    timerElement.textContent = "Le temps est écoulé"
                    inputEcriture.disabled = true
                    btnValiderMot.disabled = true
                }
            }, 1000)
        }

        let texteJoueur = inputEcriture.value
        let zoneProposition = document.querySelector(".zoneProposition")
        if (listeProposition[i].startsWith(texteJoueur)) {
            zoneProposition.style.backgroundColor = "white"
            zoneProposition.style.color = "#f76c5e"
        } else {
            zoneProposition.style.backgroundColor = "red"
            zoneProposition.style.color = "white"
            audio.play()
        }
        if (texteJoueur.length === listeProposition[i].length) {
            if (texteJoueur === listeProposition[i]) {
                score++
            }
            i++
            afficherResultat(score, i)
            inputEcriture.value = ''
            if (listeProposition[i] === undefined) {
                afficherProposition("Le jeu est fini")
                btnValiderMot.disabled = true
            } else {
                afficherProposition(listeProposition[i])
            }
        }
    })

    btnValiderMot.addEventListener("click", () => {
        i++
        afficherResultat(score, i)
        inputEcriture.value = ''
        if (listeProposition[i] === undefined) {
            afficherProposition("Le jeu est fini")
            btnValiderMot.disabled = true
        } else {
            afficherProposition(listeProposition[i])
        }
    })

    document.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            btnValiderMot.click()
        }
    })

    let listeBtnRadio = document.querySelectorAll(".optionSource input")
    for (let index = 0; index < listeBtnRadio.length; index++) {
        listeBtnRadio[index].addEventListener("change", (event) => {
            if (event.target.value === "1") {
                listeProposition = listeMots
            } else {
                listeProposition = listePhrases
            }
            afficherProposition(listeProposition[i])
        })
    }

    gererFormulaire(score)

    afficherResultat(score, i)
}
