/*********************************************************************************
 * 
 * Ce fichier contient toutes les fonctions nécessaires au fonctionnement du jeu. 
 * 
 *********************************************************************************/

/**
 * Cette fonction affiche dans la console le score de l'utilisateur
 * @param {number} score : le score de l'utilisateur
 * @param {number} nbMotsProposes : le nombre de mots proposés à l'utilisateur
 */
function afficherResultat(score, nbMotsProposes) {
    // Récupération de la zone dans laquelle on va écrire le score
    let spanScore = document.querySelector(".zoneScore span")
    // Ecriture du texte
    let affichageScore = `${score} / ${nbMotsProposes}`
    // On place le texte à l'intérieur du span. 
    spanScore.innerText = affichageScore
}

/**
 * Cette fonction affiche une proposition, que le joueur devra recopier, 
 * dans la zone "zoneProposition"
 * @param {string} proposition : la proposition à afficher
 */
function afficherProposition(proposition) {
    let inputEcriture = document.getElementById("inputEcriture")
    let zoneProposition = document.querySelector(".zoneProposition")
    inputEcriture.placeholder = proposition
    zoneProposition.innerText = proposition
    zoneProposition.style.backgroundColor = "white"; // Retire le soulignement si correct
    zoneProposition.style.color = "#f76c5e"
}

/**
 * Cette fonction construit et affiche l'email. 
 * @param {string} nom : le nom du joueur
 * @param {string} email : l'email de la personne avec qui il veut partager son score
 * @param {string} score : le score. 
 */
function afficherEmail(nom, email, score) {
    let mailto = `mailto:${email}?subject=Partage du score Azertype&body=Salut, je suis ${nom} et je viens de réaliser le score ${score} sur le site d'Azertype !`
    location.href = mailto
}

function validerNom(nom) {
    let regle = new RegExp("\\w{2}")

    if (nom.trim() === "" || !(regle.test(nom))) {
        throw new Error(`Le nom est trop court`)
    }
}

function validerEmail(email) {
    let regle = new RegExp("[a-z0-9._-]+@[a-z0-9._-]+\\.[a-z0-9._-]+")
    if (!regle.test(email)) {
        throw new Error(`L'e-mail n'est pas valide`)
    }
}

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
 * Cette fonction lance le jeu. 
 * Elle demande à l'utilisateur de choisir entre "mots" et "phrases" et lance la boucle de jeu correspondante
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
    let timerElement = document.getElementById("timer");
    let interval;


    afficherProposition(listeProposition[i])

    inputEcriture.addEventListener("input", () => {

        if (inputEcriture.value != "" && !interval) { // Démarre le timer uniquement si le champ n'est pas vide et si le timer n'est pas déjà démarré
            interval = setInterval(() => {
                if (tempsRestant > 0) {
                    tempsRestant--; // Diminue le temps
                    timerElement.textContent = tempsRestant; // Met à jour l'affichage
                } else {
                    clearInterval(interval); // Arrête le timer lorsque le temps est écoulé
                    timerElement.textContent = "Le temps est écoulé";
                    inputEcriture.disabled = true; // Désactive le champ d'entrée
                    btnValiderMot.disabled = true; // Désactive le bouton Valider
                }
            }, 1000);
        }

        let texteJoueur = inputEcriture.value
        let zoneProposition = document.querySelector(".zoneProposition")
        if (listeProposition[i].startsWith(texteJoueur)) {
            zoneProposition.style.backgroundColor = "white"; // Retire le soulignement si correct
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

    // Gestion de l'événement click sur le bouton "valider"
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

    // Gestion de l'événement change sur les boutons radios. 
    let listeBtnRadio = document.querySelectorAll(".optionSource input")
    for (let index = 0; index < listeBtnRadio.length; index++) {
        listeBtnRadio[index].addEventListener("change", (event) => {
            // Si c'est le premier élément qui a été modifié, alors nous voulons
            // jouer avec la listeMots. 
            if (event.target.value === "1") {
                listeProposition = listeMots
            } else {
                // Sinon nous voulons jouer avec la liste des phrases
                listeProposition = listePhrases
            }
            // Et on modifie l'affichage en direct. 
            afficherProposition(listeProposition[i])
        })
    }

    gererFormulaire(score)

    afficherResultat(score, i)

    
}
