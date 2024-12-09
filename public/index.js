// KÄÄNNETTY TYPESCRIPT
import { login } from "./functions/loginFunc.js";
import { fetchData } from "./utils/haeData.js";
import { apiUrl } from "./utils/variables.js";
// DATE OBJEKTI
const today = new Date().getDay();
console.log(today);
const viikonpäivät = [
    "Sunnuntai", // getDay() = 0
    "Maanantai", // getDay() = 1
    "Tiistai", // getDay() = 2 ...
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
];
/******
 *
 *
 *  DIALOGI
 *
 */
const logInNavBtn = document.querySelector("#log-in");
const dialogi1 = document.querySelector(".dialog");
const registerDialog = document.querySelector(".rek");
const closeDialogBtn = document.querySelector("#k-ulos-btn");
const burgerMenu = document.querySelector("#burger-menu");
const burgerMenuContent = document.querySelector("#burger-menu-content");
// Asiakassivu dialogi
const oma = document.querySelector(".dialog-oma");
const asiakas_btn = document.querySelector("#oma-btn");
// Modal display handling
if (logInNavBtn) {
    logInNavBtn.addEventListener("click", () => {
        console.log("klik modal auki");
        if (dialogi1.classList.contains("hidden")) {
            dialogi1.close();
            oma.showModal();
        }
        else {
            dialogi1.showModal();
        }
    });
}
if (closeDialogBtn) {
    closeDialogBtn.addEventListener("click", () => {
        console.log("klik modal kiinni");
        dialogi1.close();
    });
}
/// "OMAT SIVUT"
if (asiakas_btn) {
    asiakas_btn.addEventListener("click", () => {
        console.log("klik oma");
        oma.close();
        dialogi1.close();
        dialogi1.classList.add("hidden");
    });
}
const eyeIcons = document.querySelectorAll(".show-psw");
const salasanat = document.querySelectorAll(".salasana");
// NÄYTÄ SALASANA!
eyeIcons.forEach((eyeIcon, index) => {
    eyeIcon.addEventListener("click", () => {
        console.log("klik silmä");
        const salasanakentta = salasanat[index];
        if (salasanakentta) {
            if (salasanakentta.type === "password") {
                salasanakentta.type = "text";
            }
            else {
                salasanakentta.type = "password";
            }
        }
    });
});
// KIRJAUDU JA REKISTERÖIDY animaatio
const registerBtn = document.querySelector("#register");
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        console.log("Rekisteröidy nappia klikattu");
        registerDialog.classList.remove("dialog-piiloon");
        registerDialog.classList.add("dialog-esiin-anim");
        document.querySelector("#sposti").value = "";
        document.querySelector("#salasana").value = "";
    });
}
const kirjauduSisBtn = document.querySelector("#go-back-to-login");
if (kirjauduSisBtn) {
    kirjauduSisBtn.addEventListener("click", () => {
        console.log("Kirjaudu sisään nappia klikattu");
        registerDialog.classList.add("dialog-piiloon");
        registerDialog.classList.remove("dialog-esiin-anim");
        document.querySelector("#rek-sposti").value = "";
        document.querySelector("#rek-salasana").value = "";
        document.querySelector("#rek-username").value = "";
    });
}
// ADMIN KIRJAUTUMINEN HALLINTAAN
const kirjauduBtn = document.querySelector("#kirjaudu-btn");
const passwordInput = document.querySelector("#username");
const usernameInput = document.querySelector("#salasana");
const kirjautumisFormi = document.querySelector("#kirjautumis-formi");
if (kirjautumisFormi) {
    kirjautumisFormi.addEventListener("submit", async (evt) => {
        try {
            evt.preventDefault();
            const loginResult = await login(passwordInput, usernameInput);
            console.log(loginResult);
            localStorage.setItem("token", loginResult.token);
        }
        catch (error) {
            console.log(error.message);
        }
    });
}
// });
// modal.addEventListener("focusout", (evt) => {
//   // Close modal when out of focus
//   if (!evt.relatedTarget?.closest(".menu-hold")) {
//     modal.close();
//   }
// });
//Burgermenu display handling
burgerMenu.addEventListener("click", () => {
    //Expand nav from burger menu
    if (burgerMenuContent.style.display === "none") {
        burgerMenuContent.style.display = "flex";
        burgerMenuContent.focus();
    }
    else {
        burgerMenuContent.style.display = "none";
    }
});
// sulkee burgermenun myös muualta klikkauksella
burgerMenuContent.addEventListener("focusout", (evt) => {
    const relatedTarget = evt.relatedTarget;
    if (!relatedTarget || !relatedTarget.closest(".menu-hold")) {
        burgerMenuContent.style.display = "none";
    }
});
/*********
 *
 *
 *  RUOKALISTAN NÄYTTÄMINEN
 *
 */
const kohde = document.querySelector("#kohde");
const datatieto = async () => {
    try {
        const res = await fetch("http://localhost:3000/api/menu");
        const ruokalista = await res.json();
        kohde.innerHTML = "";
        console.log(ruokalista);
        // today = date funktiosta tsekkaamaan tämä päivä
        const tämäpäivä = viikonpäivät[today];
        // Valitun päivän menu
        const näytäMenu = (day) => {
            kohde.innerHTML = "";
            const valittuPäivä = ruokalista.find((item) => item.day === day); // Etitään päivä ruokalistasta
            if (valittuPäivä) {
                // Otsikko - viikonpäivä
                kohde.innerHTML += `
          <thead>
            <th colspan="3">${valittuPäivä.day}</th>
          </thead>
        `;
                const tablebody = document.createElement("tbody");
                tablebody.setAttribute("id", "tablebody");
                kohde.appendChild(tablebody);
                // valitun päivän annokset
                valittuPäivä.annokset.forEach((annos) => {
                    const annoksetTaulukko = `
            <tr>
              <td class="annos-td">${annos.nimi}<br>${annos.allergeenit}</td>
              <td>${annos.hinta}</td>
              <td><button id="annos-${annos.annos_id}" class="add-btn">Tilaa</button></td>
            </tr>
          `;
                    tablebody.insertAdjacentHTML("beforeend", annoksetTaulukko);
                });
            }
            else {
                kohde.innerHTML =
                    "<tr><td colspan='3'>Tänään ei tarjolla lounasta.</td></tr>";
            }
        };
        näytäMenu(tämäpäivä);
        // Lisää tapahtumakäsittelijät päivä-napeille
        const dayButtons = document.querySelectorAll(".day-btn");
        dayButtons.forEach((button) => {
            button.addEventListener("click", function () {
                const day = this.getAttribute("data-day");
                console.log("Tänään on: " + day);
                if (day) {
                    näytäMenu(day);
                }
                if (day != tämäpäivä) {
                    console.log("Eri päivät");
                    const addostos = document.querySelectorAll(".add-btn");
                    addostos.forEach((button) => {
                        button.setAttribute("disabled", "");
                    });
                }
            });
        });
    }
    catch (error) {
        console.error("Virhe haettaessa dataa:", error);
    }
};
datatieto();
// LISÄTÄÄN OMAAN SIVUUN TILAUKSET!
const omat_tilaukset = document.querySelector("#tbody-kohde-omat-tilaukset");
const haeData = async () => {
    try {
        // Haetaan data backendistä
        const tilaukset = await fetchData(apiUrl + `/menu/tilaus`);
        console.log(tilaukset);
        for (const tilaus of tilaukset) {
            let html = `
       <tr id="tilaus-${tilaus.tilaus_id}">
        <td>${tilaus.tilaus_id}</td>
        <td>${tilaus.nimet.map((nimi, index) => `${nimi} (${tilaus.määrä[index]})`).join(", ")}</td>
        <td>${new Date(tilaus.tilaus_aika).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
        <td id="tila-${tilaus.tilaus_id}" >${tilaus.tila}</td>
        <td id="nouto-${tilaus.tilaus_id}">${new Date(tilaus.nouto_aika).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
      </tr>
      `;
            // LISÄÄ user_id = tilaus_id
            omat_tilaukset.insertAdjacentHTML("beforeend", html);
        }
    }
    catch (e) {
        console.error("Tietojen hakeminen epäonnistui:", e);
    }
};
haeData();
