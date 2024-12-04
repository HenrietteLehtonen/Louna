// KÄÄNNETTY TYPESCRIPT


import { login } from "./functions/loginFunc.js";
import { validateLocaleAndSetLanguage } from "../node_modules/typescript/lib/typescript";
import { Annokset, Menu, Ruokalista } from "./types/menu";
import { fetchData } from "./utils/haeData.js";
import { apiUrl } from "./utils/variables.js";


const ruokaLista: Menu[] = [
  {
    day: "Maanantai",
    id: 1,
    annos: "Lihapullat ja muusi",
    allergeenit: ["V", "L", "G"],
    hinta: 5,
  },
  {
    day: "Maanantai",
    id: 2,
    annos: "Lohisoppa",
    allergeenit: ["G", "M"],
    hinta: 3,
  },
  {
    day: "Tiistai",
    id: 3,
    annos: "Fish & Chips",
    allergeenit: ["VL", "M", "SO"],
    hinta: 3,
  },
  {
    day: "Tiistai",
    id: 4,
    annos: "Kasvislasagne",
    allergeenit: ["VL"],
    hinta: 4,
  },
  {
    day: "Keskiviikko",
    id: 5,
    annos: "Kalakeitto",
    allergeenit: ["M", "K"],
    hinta: 5,
  },
  {
    day: "Keskiviikko",
    id: 6,
    annos: "Pinaattiletut ja puolukkahillo",
    allergeenit: ["V", "L"],
    hinta: 4,
  },
  {
    day: "Torstai",
    id: 7,
    annos: "Hernekeitto ja pannukakku",
    allergeenit: ["V", "G"],
    hinta: 3,
  },
  {
    day: "Torstai",
    id: 8,
    annos: "Jauhelihapihvi ja perunat",
    allergeenit: ["G", "M"],
    hinta: 5,
  },
  {
    day: "Perjantai",
    id: 9,
    annos: "Pizza",
    allergeenit: ["VL", "G"],
    hinta: 6,
  },
  {
    day: "Perjantai",
    id: 10,
    annos: "Tacos",
    allergeenit: ["M", "S"],
    hinta: 5,
  },
  {
    day: "Lauantai",
    id: 11,
    annos: "Nakkikastike ja perunamuusi",
    allergeenit: ["G", "M"],
    hinta: 4,
  },
  {
    day: "Lauantai",
    id: 12,
    annos: "Kasviscurry",
    allergeenit: ["V", "G"],
    hinta: 3.5,
  },
  {
    day: "Sunnuntai",
    id: 13,
    annos: "Paistettu lohi ja riisi",
    allergeenit: ["G", "M"],
    hinta: 6.5,
  },
  {
    day: "Sunnuntai",
    id: 14,
    annos: "Makaronilaatikko",
    allergeenit: ["M"],
    hinta: 4.5,
  },
];
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
  ".close-modal-btn"
) as HTMLElement;
const burgerMenu = document.querySelector("#burger-menu") as HTMLButtonElement;
const burgerMenuContent = document.querySelector(
  "#burger-menu-content"
) as HTMLElement;

// Modal display handling
if (logInNavBtn) {
  logInNavBtn.addEventListener("click", () => {
    console.log("klik modal auki");
    dialogi1.showModal();
  });
}

if (closeDialogBtn) {
  closeDialogBtn.addEventListener("click", () => {
    console.log("klik modal kiinni");
    dialogi1.close();
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
const kirjautumisFormi = document.querySelector('#kirjautumis-formi') as HTMLFormElement


if (kirjautumisFormi) {
  kirjautumisFormi.addEventListener('submit', async (evt) => {
    try {
    evt.preventDefault();
    const loginResult = await login(passwordInput, usernameInput);
    console.log(loginResult)
    localStorage.setItem('token', loginResult.token)

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
    const res = await fetch("http://localhost:3000/api/menu");
    const ruokalista: Ruokalista[] = await res.json();
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
          <tr>
            <th colspan="3">${valittuPäivä.day}</th>
          </tr>
        `;

        // valitun päivän annokset
        valittuPäivä.annokset.forEach((annos) => {
          const annoksetTaulukko = `
            <tr>
              <td class="annos-td">${annos.nimi}<br>${annos.allergeenit}</td>
              <td>${annos.hinta}</td>
              <td><button id="annos-${annos.annos_id}" class="add-btn">Tilaa</button></td>
            </tr>
          `;
          kohde.insertAdjacentHTML("beforeend", annoksetTaulukko);
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

    // verrataan onko tämä päivä napin päivä -> jos ei lisätään nappeihin attribuutti diabled, ettei pysty klikkaa
  } catch (error) {
    console.error("Virhe haettaessa dataa:", error);
  }
};

datatieto();

// // napit
// const dayButtons: NodeListOf<HTMLButtonElement> =
//   document.querySelectorAll(".day-btn");
// dayButtons.forEach((button) => {
//   button.addEventListener("click", function () {
//     const day = this.getAttribute("data-day");
//     console.log("Tänään on :" + day);
//   });
// });

// const haetieto = async () => {
//   try{
//   let menu = await fetchData<Ruokalista>(apiUrl + `/menu`);

//   console.log(menu.day);
//   menu.annokset.forEach((annos) => {
//     console.log(`${annos.nimi}`);
//   });
//   }catch(error){
//     console.log("Ei onnistu!");
//   }
// };
// haetieto();
