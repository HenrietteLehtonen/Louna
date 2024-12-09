import { Menu, Ruokalista, Annokset, Tilaukset } from "./types/menu";
import { fetchData } from "./utils/haeData.js";
import { apiUrl } from "../utils/variables.js";

// Mock data
// const lista: Menu[] = [
//   {
//     day: "Maanantai",
//     id: 1,
//     annos: "Lihapullat ja muusi",
//     allergeenit: ["V", "L", "G"],
//     hinta: 5,
//   },
//   {
//     day: "Maanantai",
//     id: 2,
//     annos: "Lohisoppa",
//     allergeenit: ["G", "M"],
//     hinta: 3,
//   },
//   {
//     day: "Tiistai",
//     id: 3,
//     annos: "Fish & Chips",
//     allergeenit: ["VL", "M", "SO"],
//     hinta: 3,
//   },
// ];

const viikonpäivät: string[] = [
  "Maanantai",
  "Tiistai",
  "Keskiviikko",
  "Torstai",
  "Perjantai",
];

const kohde = document.querySelector("#tbody-kohde") as HTMLElement;
//

/***************************
 *
 * ANNOKSEN LISÄÄMINEN JA POISTAMINEN
 *
 **********************************/

// Aavaa annoksen lisäys laatikko
const addAnnos = document.querySelector("#addBtn") as HTMLButtonElement;
if (!addAnnos) {
  console.log("Lisää annos nappia ei löytynyt!");
}
addAnnos.addEventListener("click", function () {
  console.log("Lisää annos nappia painettu");
  document.querySelector("#hidden")!.removeAttribute("id");
});

// Poista kaikki annokset
const delAll = document.querySelector("#deleteAllBtn") as HTMLButtonElement;
if (!delAll) {
  console.log("Poista kaikkia nappia ei löytynyt!");
}
delAll.addEventListener("click", async () => {
  try {
    const options: RequestInit = {
      method: "DELETE",
      // headers: {
      //   Authorization: "Bearer " + token,
      // },
    };
    // yhteys backendiin
    const result = await fetchData<Annokset>(apiUrl + `/menu`, options);

    // poistetaan kaikki annosrivit taulukosta
    const annosRivit = document.querySelectorAll("tr.annos-rivi");
    annosRivit.forEach((rivi) => rivi.remove());
    console.log("Kaikki annoksett poistettu");
  } catch (error) {
    console.error("Annoksia ei pystytä poistamaan");
  }
});

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VyX2xldmVsX2lkIjoxLCJpYXQiOjE3MzM2ODczNDIsImV4cCI6MTczMzc3Mzc0Mn0.8bYgnmTClI7Or2y4MwmuxjayzH6lYvVG2PENzU6VFrA";

// Poista yksittäinen annos
const deletebuttonlistener = (menu: Annokset) => {
  const del = document.querySelector(
    `#del-${menu.annos_id}`
  ) as HTMLButtonElement;
  if (!del) {
    console.log("Poista napia ei löytynyt!");
  }
  del.addEventListener("click", async () => {
    try {
      const options: RequestInit = {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      // yhteys backendiin
      const result = await fetchData<Annokset>(
        apiUrl + `/menu/${menu.annos_id}`,
        options
      );
      console.log(result);

      // poista taulukosta
      kohde.removeChild(
        document.querySelector(`#tr-${menu.annos_id}`) as HTMLElement
      );
      console.log(`Poistettu: ${menu.annos_id}`);
    } catch (error) {
      console.error("Ei onnistuttu poistamaan.");
    }
  });
};

// Lisää annos
const save = document.querySelector("#save-btn") as HTMLButtonElement;

if (!save) {
  console.log("Lisää nappia ei löydetty!");
}

/**
 *
 *  LISÄÄ ANNOS BACKEND
 *
 */
save.addEventListener("click", async () => {
  try {
    console.log("Haetaan dataa...");

    // haetaan input kentät
    let data = {
      day_name: (document.querySelector("#päivä-valitsin") as HTMLSelectElement)
        .value,
      nimi: (document.querySelector("#annos") as HTMLInputElement).value,
      allerg_id: (
        document.querySelector(".checkbox:checked") as HTMLInputElement
      ).value,
      hinta: (document.querySelector("#price") as HTMLInputElement).value,
    };
    // muutetaan options, koska ei käyteta GET
    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const result = await fetchData<Annokset>(apiUrl + "/menu", options);
    console.log(result);

    /// LISÄTÄÄN HTML
    const uusiAnnosHTML = luoAnnosRivi(data.day_name, {
      annos_id: result.annos_id,
      nimi: data.nimi,
      allergeenit: (
        document.querySelector(".checkbox:checked") as HTMLInputElement
      ).name,
      hinta: data.hinta,
    });

    const päiväRiv = document.querySelector(
      `.päivä-rivi[data-päivä="${data.day_name}"]`
    ) as HTMLElement;

    if (päiväRiv) {
      päiväRiv.insertAdjacentHTML("afterend", uusiAnnosHTML);
    }
    console.log("Annos lisätty onnistuneesti");

    // formin tyhjennys
    (document.querySelector("#päivä-valitsin") as HTMLSelectElement).value = "";
    (document.querySelector("#annos") as HTMLInputElement).value = "";
    (document.querySelector(".checkbox:checked") as HTMLInputElement).value =
      "";
    (document.querySelector("#price") as HTMLInputElement).value = "";
    // piilotetaan annoksen lisäämisen jälkeen
    const add = document.querySelector(
      ".container-ruokavalinta"
    ) as HTMLElement;
    add.setAttribute("id", "hidden");
  } catch (error) {
    console.error("Ei onnistuttu lisäämään annosta");
  }
});

// Peruuta

const peruuta = document.querySelector("#peruuta") as HTMLButtonElement;
if (!peruuta) {
  console.log("Peruuta nappia ei löytynyt!");
}
peruuta.addEventListener("click", function () {
  console.log("Peruuta nappia painettu");
  (
    document.querySelector(".container-ruokavalinta") as HTMLElement
  ).setAttribute("id", "hidden");

  // tyhjennetään formi
  (document.querySelector("#annos") as HTMLInputElement).value = "";
  (document.querySelector("#price") as HTMLInputElement).value = "";
  document
    .querySelectorAll<HTMLInputElement>(".checkbox")
    .forEach((checkbox) => (checkbox.checked = false));
});

/***************************
 *
 * VIIKONPÄIVIEN LUONTII TAULUKKOA VARTEN
 *
 **********************************/

const teeViikonpäivät = () => {
  for (const päivä of viikonpäivät) {
    const päiväRivi = document.createElement("tr");
    päiväRivi.classList.add("päivä-rivi");
    päiväRivi.setAttribute("data-päivä", päivä);
    päiväRivi.innerHTML = `
        <td colspan="1">${päivä}</td>
      `;
    kohde.appendChild(päiväRivi);
  }
};
teeViikonpäivät();

/***************************
 *
 * TAULUKONLUONTI
 *
 ***************************/

console.log(":)");

/**
 *
 *
 *  UUS TESTI BACKEND YHTEYS
 *
 */

// const haeData = async () => {
//   try {
//     const ruokalista = await fetchData<Ruokalista[]>(apiUrl + `/menu`);

//     for (const päivä of ruokalista) {
//       // console.log(päivä.annokset);

//       const päivänAnnokset = päivä.annokset;
//       päivänAnnokset.forEach((annos) => {
//         // console.log(annos);

//         let html = `
//           <tr id="tr-${annos.annos_id}" class="annos-rivi" data-päivä="${päivä.day}">
//           <td></td>
//             <td>${annos.nimi}</td>
//             <td>${annos.allergeenit}</td>
//             <td>${annos.hinta}</td>
//             <td><button id="del-${annos.annos_id}" class="del-btn">x</button></td>
//           </tr>
//           `;

//         // iskee jokaiselle päivälle kokolistan
//         const päiväRiv = document.querySelector(
//           `.päivä-rivi[data-päivä="${päivä.day}"]`
//         ) as HTMLElement;

//         päiväRiv.insertAdjacentHTML("afterend", html);
//         deletebuttonlistener(annos);
//       });
//     }
//     console.log(":)");
//   } catch (error) {
//     console.error("Ei löydy:", error);
//   }
// };
const luoAnnosRivi = (päivä: string, annos: any): string => {
  return `
    <tr id="tr-${annos.annos_id}" class="annos-rivi" data-päivä="${päivä}">
      <td></td>
      <td>${annos.nimi}</td>
      <td>${annos.allergeenit}</td>
      <td>${annos.hinta}</td>
      <td><button id="del-${annos.annos_id}" class="del-btn">x</button></td>
    </tr>
  `;
};

const haeData = async () => {
  try {
    const ruokalista = await fetchData<Ruokalista[]>(apiUrl + `/menu`);

    for (const päivä of ruokalista) {
      const päivänAnnokset = päivä.annokset;

      päivänAnnokset.forEach((annos) => {
        // jokaiselle annokselle oma rivi
        const html = luoAnnosRivi(päivä.day, annos);

        // lisää rivin oikean päivän kohdalle
        const päiväRiv = document.querySelector(
          `.päivä-rivi[data-päivä="${päivä.day}"]`
        ) as HTMLElement;

        if (päiväRiv) {
          päiväRiv.insertAdjacentHTML("afterend", html);
        }
        deletebuttonlistener(annos);
      });
    }
    console.log(":)");
  } catch (error) {
    console.error("Ei löydy:", error);
  }
};
haeData();
