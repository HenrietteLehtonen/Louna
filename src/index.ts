// KÄÄNNETTY TYPESCRIPT

import { Menu } from "./types/menu";

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

const logInNavBtn = document.querySelector("#log-in") as HTMLButtonElement;
const modal = document.querySelector("dialog") as HTMLDialogElement;
const closeDialogBtn = document.querySelector(
  ".close-modal-btn"
) as HTMLElement;
const burgerMenu = document.querySelector("#burger-menu") as HTMLButtonElement;
const burgerMenuContent = document.querySelector(
  "#burger-menu-content"
) as HTMLElement;

// Modal display handling
logInNavBtn.addEventListener("click", () => {
  modal.showModal();
});

closeDialogBtn.addEventListener("click", () => {
  console.log("klik");
  modal.close();
});
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

// Näytetään päivän ruokalista
const showMenu = (): void => {
  const dayButtons: NodeListOf<HTMLButtonElement> =
    document.querySelectorAll(".day-btn");
  //const kohde = document.querySelector("#kohde") as HTMLElement;
  const kohde: HTMLElement = document.querySelector("#kohde")!;

  const tämäpäivä: string = viikonpäivät[today];

  // Näytetään tämän päivän menu
  const näytäPäivänMenu = (day: string): void => {
    const päivänRuoka: Menu[] = ruokaLista.filter((ruoka) => ruoka.day === day);
    kohde.innerHTML = "";

    // Lisää päivän otsikko
    const päiväOtsikko: string = `
      <tr>
        <th colspan=3>${day}</th>
      </tr>
    `;
    kohde.insertAdjacentHTML("beforeend", päiväOtsikko);

    // Lisää ruokalistan annokset per päivä
    päivänRuoka.forEach((ruoka) => {
      const annoksetTaulukko: string = `
        <tr>
          <td class="annos-td">
            ${ruoka.annos}<br>
            ${ruoka.allergeenit.join(", ")}
          </td>
          <td>${ruoka.hinta}€ </td>
          <td><button class="add-btn">+</button></td>
        </tr>
      `;
      kohde.insertAdjacentHTML("beforeend", annoksetTaulukko);
    });
  };

  // Näytetään tämän päivän menu automaattisesti
  näytäPäivänMenu(tämäpäivä);

  // Napeista näyttämään muut päivät
  dayButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const day = this.getAttribute("data-day");
      if (day) {
        näytäPäivänMenu(day);
      }
    });
  });
};

showMenu();
