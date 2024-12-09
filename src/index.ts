// KÄÄNNETTY TYPESCRIPT

import { login } from "./functions/loginFunc.js";
import { validateLocaleAndSetLanguage } from "../node_modules/typescript/lib/typescript";
import {
  Annokset,
  Menu,
  OstoskoriItem,
  Ruokalista,
  Tilaukset,
} from "./types/menu";

import { fetchData } from "./utils/haeData.js";
import { apiUrl } from "./utils/variables.js";
import { lisaaOstoskoriin } from "./ostoskori.js";

// DATE OBJEKTI
const today: number = new Date().getDay();
console.log(today);

const viikonpäivät: string[] = [
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

const logInNavBtn = document.querySelector("#log-in") as HTMLButtonElement;
const dialogi1 = document.querySelector(".dialog") as HTMLDialogElement;
const registerDialog = document.querySelector(".rek") as HTMLDialogElement;
const closeDialogBtn = document.querySelector(
  "#k-ulos-btn"
) as HTMLButtonElement;
const burgerMenu = document.querySelector("#burger-menu") as HTMLButtonElement;
const burgerMenuContent = document.querySelector(
  "#burger-menu-content"
) as HTMLElement;

// Asiakassivu dialogi
const oma = document.querySelector(".dialog-oma") as HTMLDialogElement;
const asiakas_btn = document.querySelector("#oma-btn") as HTMLButtonElement;

// Modal display handling
if (logInNavBtn) {
  logInNavBtn.addEventListener("click", () => {
    console.log("klik modal auki");

    if (dialogi1.classList.contains("hidden")) {
      dialogi1.close();
      oma.showModal();
    } else {
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

const eyeIcons = document.querySelectorAll<HTMLElement>(".show-psw");
const salasanat = document.querySelectorAll<HTMLInputElement>(".salasana");

// NÄYTÄ SALASANA!
eyeIcons.forEach((eyeIcon, index) => {
  eyeIcon.addEventListener("click", () => {
    console.log("klik silmä");

    const salasanakentta = salasanat[index];

    if (salasanakentta) {
      if (salasanakentta.type === "password") {
        salasanakentta.type = "text";
      } else {
        salasanakentta.type = "password";
      }
    }
  });
});

// KIRJAUDU JA REKISTERÖIDY animaatio

const registerBtn = document.querySelector("#register") as HTMLButtonElement;

if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    console.log("Rekisteröidy nappia klikattu");

    registerDialog.classList.remove("dialog-piiloon");
    registerDialog.classList.add("dialog-esiin-anim");

    (document.querySelector("#sposti") as HTMLInputElement).value = "";
    (document.querySelector("#salasana") as HTMLInputElement).value = "";
  });
}

const kirjauduSisBtn = document.querySelector(
  "#go-back-to-login"
) as HTMLButtonElement;
if (kirjauduSisBtn) {
  kirjauduSisBtn.addEventListener("click", () => {
    console.log("Kirjaudu sisään nappia klikattu");
    registerDialog.classList.add("dialog-piiloon");
    registerDialog.classList.remove("dialog-esiin-anim");
    (document.querySelector("#rek-sposti") as HTMLInputElement).value = "";
    (document.querySelector("#rek-salasana") as HTMLInputElement).value = "";
    (document.querySelector("#rek-username") as HTMLInputElement).value = "";
  });
}

// ADMIN KIRJAUTUMINEN HALLINTAAN
const kirjauduBtn = document.querySelector("#kirjaudu-btn");

const passwordInput = document.querySelector("#username") as HTMLInputElement;
const usernameInput = document.querySelector("#salasana") as HTMLInputElement;
const kirjautumisFormi = document.querySelector(
  "#kirjautumis-formi"
) as HTMLFormElement;

if (kirjautumisFormi) {
  kirjautumisFormi.addEventListener("submit", async (evt) => {
    try {
      evt.preventDefault();
      const loginResult = await login(passwordInput, usernameInput);
      console.log(loginResult);
      localStorage.setItem("token", loginResult.token);
    } catch (error) {
      console.log((error as Error).message);
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
  } else {
    burgerMenuContent.style.display = "none";
  }
});

// sulkee burgermenun myös muualta klikkauksella
burgerMenuContent.addEventListener("focusout", (evt: FocusEvent) => {
  const relatedTarget = evt.relatedTarget as HTMLElement | null;
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

const kohde: HTMLElement = document.querySelector("#kohde")!;

const datatieto = async (): Promise<void> => {
  try {
    const ruokalista = await fetchData<Ruokalista[]>(apiUrl + "/menu");
    kohde.innerHTML = "";
    console.log(ruokalista);

    // today = date funktiosta tsekkaamaan tämä päivä
    const tämäpäivä: string = viikonpäivät[today];
    // Valitun päivän menu
    const näytäMenu = (day: string) => {
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

          const annosButton = document.querySelector(
            "#annos-" + annos.annos_id
          ) as HTMLButtonElement;

          if (annosButton) {
            annosButton.addEventListener("click", async (event) => {
              const ruokaNimi = annos.nimi;
              const hinta = annos.hinta;
              const annos_id = annos.annos_id;
              if (isNaN(hinta)) {
                console.error("Virheellinen hinta-arvo:", hinta);
                return;
              }
              const ruoka: OstoskoriItem = {
                nimi: ruokaNimi,
                hinta: { muu: hinta },
                maara: 0,
                annos_id,
              };
              lisaaOstoskoriin(ruoka);
            });
          }
        });
      } else {
        kohde.innerHTML =
          "<tr><td colspan='3'>Tänään ei tarjolla lounasta.</td></tr>";
      }
    };
    näytäMenu(tämäpäivä);

    // Lisää tapahtumakäsittelijät päivä-napeille
    const dayButtons: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll(".day-btn");

    dayButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const day = this.getAttribute("data-day")!;
        console.log("Tänään on: " + day);
        if (day) {
          näytäMenu(day);
        }

        if (day != tämäpäivä) {
          console.log("Eri päivät");
          const addostos: NodeListOf<HTMLButtonElement> =
            document.querySelectorAll(".add-btn");
          addostos.forEach((button) => {
            button.setAttribute("disabled", "");
          });
        }
      });
    });
  } catch (error) {
    console.error("Virhe haettaessa dataa:", error);
  }
};

/* 
annosButton.addEventListener("click", async (event) => {
  if ((event.target as HTMLElement).classList.contains("add-btn")) {
    const row = (event.target as HTMLElement).closest(
      "tr"
    ) as HTMLTableRowElement;
    const ruokaNimi =
      row.querySelector("td")?.childNodes[0].textContent?.trim() ||
      "";

    const hintaText =
      row.querySelectorAll("td")[1]?.textContent || "";

    const parsedHintaText = hintaText.split("/")[0].trim();
    const hinta = parseFloat(
      parsedHintaText.replace(/[^0-9,.]/g, "").replace(",", ".")
    );

    if (isNaN(hinta)) {
      console.error("Virheellinen hinta-arvo:", parsedHintaText);
      return;
    }

    const ruoka: OstoskoriItem = {
      nimi: ruokaNimi,
      hinta: { muu: hinta },
      maara: 0,
    };

    lisaaOstoskoriin(ruoka);
 */

datatieto();

// LISÄTÄÄN OMAAN SIVUUN TILAUKSET!
const omat_tilaukset = document.querySelector(
  "#tbody-kohde-omat-tilaukset"
) as HTMLElement;
const haeData = async () => {
  try {
    // Haetaan data backendistä
    const tilaukset = await fetchData<Tilaukset[]>(apiUrl + `/menu/tilaus`);
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
  } catch (e) {
    console.error("Tietojen hakeminen epäonnistui:", e);
  }
};
haeData();
